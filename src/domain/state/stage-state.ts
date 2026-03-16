import { LeadFinalizeOutcome, LeadStageName } from "../types";
import { Lead } from "../lead";

export interface StageState {
  name: LeadStageName;
  advance(lead: Lead): void;
  finalize(lead: Lead, outcome: LeadFinalizeOutcome): void;
}

export function stageStateFromName(name: LeadStageName): StageState {
  switch (name) {
    case "Contato inicial":
      return new ContatoInicialState();
    case "Enviou proposta":
      return new EnviouPropostaState();
    case "Aguardando resposta do cliente":
      return new AguardandoRespostaState();
    case "Aguardando pagamento":
      return new AguardandoPagamentoState();
    case "Finalizado":
      return new FinalizadoState();
    default:
      return new ContatoInicialState();
  }
}

export class ContatoInicialState implements StageState {
  name: LeadStageName = "Contato inicial";

  advance(lead: Lead): void {
    lead.setStage(new EnviouPropostaState());
    lead.setStatus("Em negociacao");
  }

  finalize(lead: Lead, outcome: LeadFinalizeOutcome): void {
    lead.finalizeOutcome(outcome);
  }
}

export class EnviouPropostaState implements StageState {
  name: LeadStageName = "Enviou proposta";

  advance(lead: Lead): void {
    lead.setStage(new AguardandoRespostaState());
  }

  finalize(lead: Lead, outcome: LeadFinalizeOutcome): void {
    lead.finalizeOutcome(outcome);
  }
}

export class AguardandoRespostaState implements StageState {
  name: LeadStageName = "Aguardando resposta do cliente";

  advance(lead: Lead): void {
    lead.setStage(new AguardandoPagamentoState());
  }

  finalize(lead: Lead, outcome: LeadFinalizeOutcome): void {
    lead.finalizeOutcome(outcome);
  }
}

export class AguardandoPagamentoState implements StageState {
  name: LeadStageName = "Aguardando pagamento";

  advance(lead: Lead): void {
    throw new Error("Lead ja esta aguardando pagamento");
  }

  finalize(lead: Lead, outcome: LeadFinalizeOutcome): void {
    lead.finalizeOutcome(outcome);
  }
}

export class FinalizadoState implements StageState {
  name: LeadStageName = "Finalizado";

  advance(): void {
    throw new Error("Lead finalizada nao pode avancar");
  }

  finalize(): void {
    throw new Error("Lead finalizada nao pode mudar status");
  }
}
