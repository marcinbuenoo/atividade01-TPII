export type LeadStageName =
  | "Contato inicial"
  | "Enviou proposta"
  | "Aguardando resposta do cliente"
  | "Aguardando pagamento"
  | "Finalizado";

export type LeadStatusName =
  | "Aberto"
  | "Em negociacao"
  | "Finalizado com venda"
  | "Finalizado sem venda";

export type LeadOriginName =
  | "visita presencial"
  | "telefone"
  | "WhatsApp"
  | "Instagram";

export type LeadFinalizeOutcome = "sale" | "no_sale";

export interface LeadSnapshot {
  id: string;
  name: string;
  phone: string;
  origin: LeadOriginName;
  vehicle: string;
  stage: LeadStageName;
  status: LeadStatusName;
}
