"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const crypto_1 = require("crypto");
const observer_1 = require("./observer/observer");
const stage_state_1 = require("./state/stage-state");
class Lead {
    stageState;
    status;
    subject = new observer_1.Subject();
    history = [];
    id;
    name;
    phone;
    vehicle;
    origin;
    constructor(params) {
        this.id = params.id ?? (0, crypto_1.randomUUID)();
        this.name = params.name;
        this.phone = params.phone;
        this.vehicle = params.vehicle;
        this.origin = params.origin;
        this.stageState = params.stage ? (0, stage_state_1.stageStateFromName)(params.stage) : new stage_state_1.ContatoInicialState();
        this.status = params.status ?? "Aberto";
        if (!params.skipAudit) {
            this.recordEvent("LEAD_CREATED", {
                stage: this.stageState.name,
                status: this.status,
                origin: this.origin.value,
            });
        }
    }
    static rehydrate(params) {
        return new Lead({
            id: params.id,
            name: params.name,
            phone: params.phone,
            vehicle: params.vehicle,
            origin: params.origin,
            stage: params.stage,
            status: params.status,
            skipAudit: true,
        });
    }
    getStage() {
        return this.stageState.name;
    }
    getStatus() {
        return this.status;
    }
    getOrigin() {
        return this.origin.value;
    }
    getHistory() {
        return [...this.history];
    }
    attachObserver(observer) {
        this.subject.attach(observer);
    }
    advanceStage() {
        if (this.isFinalized()) {
            throw new Error("Lead finalizada nao pode avancar");
        }
        const previous = this.stageState.name;
        this.stageState.advance(this);
        this.recordEvent("STAGE_CHANGED", {
            from: previous,
            to: this.stageState.name,
        });
    }
    finalize(outcome) {
        if (this.isFinalized()) {
            throw new Error("Lead finalizada nao pode mudar status");
        }
        this.stageState.finalize(this, outcome);
    }
    setStage(state) {
        this.stageState = state;
    }
    setStatus(status) {
        if (this.status === status) {
            return;
        }
        this.status = status;
        this.recordEvent("STATUS_CHANGED", { status });
    }
    finalizeOutcome(outcome) {
        if (outcome === "sale") {
            this.setStatus("Finalizado com venda");
        }
        else {
            this.setStatus("Finalizado sem venda");
        }
        this.setStage(new stage_state_1.FinalizadoState());
    }
    isFinalized() {
        return this.status.startsWith("Finalizado");
    }
    toSnapshot() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            origin: this.getOrigin(),
            vehicle: this.vehicle,
            stage: this.getStage(),
            status: this.getStatus(),
        };
    }
    recordEvent(type, payload) {
        const event = {
            leadId: this.id,
            type,
            payload,
            occurredAt: new Date().toISOString(),
        };
        this.history.push(event);
        this.subject.notify(event);
    }
}
exports.Lead = Lead;
