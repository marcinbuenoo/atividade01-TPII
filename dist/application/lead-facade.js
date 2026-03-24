"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadFacade = exports.AppError = void 0;
const lead_1 = require("../domain/lead");
const lead_origin_factory_1 = require("../domain/factory/lead-origin-factory");
const validation_1 = require("../domain/validation/validation");
const console_audit_observer_1 = require("../domain/observer/console-audit-observer");
class AppError extends Error {
    status;
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}
exports.AppError = AppError;
class LeadFacade {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async createLead(input) {
        const validator = new validation_1.RequiredFieldsValidator();
        validator.setNext(new validation_1.PhoneValidator()).setNext(new validation_1.OriginValidator());
        const result = validator.handle(input);
        if (!result.ok) {
            throw new AppError(result.message, 400);
        }
        const origin = lead_origin_factory_1.LeadOriginFactory.create(input.origin);
        const lead = new lead_1.Lead({
            name: input.name,
            phone: input.phone,
            vehicle: input.vehicle,
            origin,
        });
        lead.attachObserver(new console_audit_observer_1.ConsoleAuditObserver());
        await this.repository.save(lead);
        return lead.toSnapshot();
    }
    async listLeads() {
        const leads = await this.repository.findAll();
        return leads.map((lead) => lead.toSnapshot());
    }
    async getLead(id) {
        const lead = await this.repository.findById(id);
        if (!lead) {
            throw new AppError("Lead nao encontrada", 404);
        }
        return lead.toSnapshot();
    }
    async advanceLead(id) {
        const lead = await this.repository.findById(id);
        if (!lead) {
            throw new AppError("Lead nao encontrada", 404);
        }
        try {
            lead.advanceStage();
            await this.repository.save(lead);
        }
        catch (error) {
            throw new AppError(error.message, 400);
        }
        return lead.toSnapshot();
    }
    async finalizeLead(id, outcome) {
        const validator = new validation_1.OutcomeValidator();
        const result = validator.handle({ outcome });
        if (!result.ok) {
            throw new AppError(result.message, 400);
        }
        const lead = await this.repository.findById(id);
        if (!lead) {
            throw new AppError("Lead nao encontrada", 404);
        }
        try {
            lead.finalize(outcome);
            await this.repository.save(lead);
        }
        catch (error) {
            throw new AppError(error.message, 400);
        }
        return lead.toSnapshot();
    }
}
exports.LeadFacade = LeadFacade;
