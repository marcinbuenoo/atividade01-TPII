export type ValidationResult = { ok: true } | { ok: false; message: string };

export interface ValidationPayload {
  name?: string;
  phone?: string;
  origin?: string;
  vehicle?: string;
  outcome?: string;
}

// Chain of Responsibility: encadeia validacoes
export abstract class ValidationHandler {
  private next: ValidationHandler | null = null;

  setNext(next: ValidationHandler): ValidationHandler {
    this.next = next;
    return next;
  }

  handle(payload: ValidationPayload): ValidationResult {
    const result = this.validate(payload);
    if (!result.ok) {
      return result;
    }
    if (this.next) {
      return this.next.handle(payload);
    }
    return { ok: true };
  }

  protected abstract validate(payload: ValidationPayload): ValidationResult;
}

export class RequiredFieldsValidator extends ValidationHandler {
  protected validate(payload: ValidationPayload): ValidationResult {
    if (!payload.name || !payload.phone || !payload.origin || !payload.vehicle) {
      return { ok: false, message: "Campos obrigatorios ausentes" };
    }
    return { ok: true };
  }
}

export class PhoneValidator extends ValidationHandler {
  protected validate(payload: ValidationPayload): ValidationResult {
    if (!payload.phone) {
      return { ok: true };
    }
    const cleaned = payload.phone.replace(/\D/g, "");
    if (cleaned.length < 8) {
      return { ok: false, message: "Telefone invalido" };
    }
    return { ok: true };
  }
}

export class OriginValidator extends ValidationHandler {
  private readonly allowed = [
    "visita presencial",
    "telefone",
    "WhatsApp",
    "Instagram",
  ];

  protected validate(payload: ValidationPayload): ValidationResult {
    if (!payload.origin) {
      return { ok: true };
    }
    if (!this.allowed.includes(payload.origin)) {
      return { ok: false, message: "Origem invalida" };
    }
    return { ok: true };
  }
}

export class OutcomeValidator extends ValidationHandler {
  protected validate(payload: ValidationPayload): ValidationResult {
    if (!payload.outcome) {
      return { ok: false, message: "Outcome obrigatorio" };
    }
    if (payload.outcome !== "sale" && payload.outcome !== "no_sale") {
      return { ok: false, message: "Outcome invalido" };
    }
    return { ok: true };
  }
}
