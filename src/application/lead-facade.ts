import { Lead } from "../domain/lead";
import { LeadOriginFactory } from "../domain/factory/lead-origin-factory";
import {
  LeadFinalizeOutcome,
  LeadOriginName,
  LeadSnapshot,
} from "../domain/types";
import {
  OriginValidator,
  OutcomeValidator,
  PhoneValidator,
  RequiredFieldsValidator,
} from "../domain/validation/validation";
import { ConsoleAuditObserver } from "../domain/observer/console-audit-observer";
import { LeadRepository } from "../infra/lead-repository";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export class LeadFacade {
  constructor(private repository: LeadRepository) {}

  async createLead(input: {
    name: string;
    phone: string;
    origin: LeadOriginName;
    vehicle: string;
  }): Promise<LeadSnapshot> {
    const validator = new RequiredFieldsValidator();
    validator.setNext(new PhoneValidator()).setNext(new OriginValidator());

    const result = validator.handle(input);
    if (!result.ok) {
      throw new AppError(result.message, 400);
    }

    const origin = LeadOriginFactory.create(input.origin);
    const lead = new Lead({
      name: input.name,
      phone: input.phone,
      vehicle: input.vehicle,
      origin,
    });

    lead.attachObserver(new ConsoleAuditObserver());

    await this.repository.save(lead);
    return lead.toSnapshot();
  }

  async listLeads(): Promise<LeadSnapshot[]> {
    const leads = await this.repository.findAll();
    return leads.map((lead) => lead.toSnapshot());
  }

  async getLead(id: string): Promise<LeadSnapshot> {
    const lead = await this.repository.findById(id);
    if (!lead) {
      throw new AppError("Lead nao encontrada", 404);
    }
    return lead.toSnapshot();
  }

  async advanceLead(id: string): Promise<LeadSnapshot> {
    const lead = await this.repository.findById(id);
    if (!lead) {
      throw new AppError("Lead nao encontrada", 404);
    }
    try {
      lead.advanceStage();
      await this.repository.save(lead);
    } catch (error) {
      throw new AppError((error as Error).message, 400);
    }
    return lead.toSnapshot();
  }

  async finalizeLead(id: string, outcome: LeadFinalizeOutcome): Promise<LeadSnapshot> {
    const validator = new OutcomeValidator();
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
    } catch (error) {
      throw new AppError((error as Error).message, 400);
    }
    return lead.toSnapshot();
  }
}
