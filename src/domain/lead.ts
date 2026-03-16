import { randomUUID } from "crypto";
import {
  LeadFinalizeOutcome,
  LeadOriginName,
  LeadSnapshot,
  LeadStageName,
  LeadStatusName,
} from "./types";
import { OriginChannel } from "./factory/lead-origin-factory";
import { LeadEvent, Subject } from "./observer/observer";
import {
  ContatoInicialState,
  FinalizadoState,
  StageState,
  stageStateFromName,
} from "./state/stage-state";

export class Lead {
  private stageState: StageState;
  private status: LeadStatusName;
  private subject = new Subject<LeadEvent>();
  private history: LeadEvent[] = [];

  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly vehicle: string;
  readonly origin: OriginChannel;

  constructor(params: {
    name: string;
    phone: string;
    vehicle: string;
    origin: OriginChannel;
    id?: string;
    stage?: LeadStageName;
    status?: LeadStatusName;
    skipAudit?: boolean;
  }) {
    this.id = params.id ?? randomUUID();
    this.name = params.name;
    this.phone = params.phone;
    this.vehicle = params.vehicle;
    this.origin = params.origin;
    this.stageState = params.stage ? stageStateFromName(params.stage) : new ContatoInicialState();
    this.status = params.status ?? "Aberto";

    if (!params.skipAudit) {
      this.recordEvent("LEAD_CREATED", {
        stage: this.stageState.name,
        status: this.status,
        origin: this.origin.value,
      });
    }
  }

  static rehydrate(params: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    origin: OriginChannel;
    stage: LeadStageName;
    status: LeadStatusName;
  }): Lead {
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

  getStage(): LeadStageName {
    return this.stageState.name;
  }

  getStatus(): LeadStatusName {
    return this.status;
  }

  getOrigin(): LeadOriginName {
    return this.origin.value;
  }

  getHistory(): LeadEvent[] {
    return [...this.history];
  }

  attachObserver(observer: { update: (event: LeadEvent) => void }): void {
    this.subject.attach(observer);
  }

  advanceStage(): void {
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

  finalize(outcome: LeadFinalizeOutcome): void {
    if (this.isFinalized()) {
      throw new Error("Lead finalizada nao pode mudar status");
    }
    this.stageState.finalize(this, outcome);
  }

  setStage(state: StageState): void {
    this.stageState = state;
  }

  setStatus(status: LeadStatusName): void {
    if (this.status === status) {
      return;
    }
    this.status = status;
    this.recordEvent("STATUS_CHANGED", { status });
  }

  finalizeOutcome(outcome: LeadFinalizeOutcome): void {
    if (outcome === "sale") {
      this.setStatus("Finalizado com venda");
    } else {
      this.setStatus("Finalizado sem venda");
    }
    this.setStage(new FinalizadoState());
  }

  isFinalized(): boolean {
    return this.status.startsWith("Finalizado");
  }

  toSnapshot(): LeadSnapshot {
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

  private recordEvent(type: LeadEvent["type"], payload: Record<string, unknown>): void {
    const event: LeadEvent = {
      leadId: this.id,
      type,
      payload,
      occurredAt: new Date().toISOString(),
    };
    this.history.push(event);
    this.subject.notify(event);
  }
}
