"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutcomeValidator = exports.OriginValidator = exports.PhoneValidator = exports.RequiredFieldsValidator = exports.ValidationHandler = void 0;
class ValidationHandler {
    next = null;
    setNext(next) {
        this.next = next;
        return next;
    }
    handle(payload) {
        const result = this.validate(payload);
        if (!result.ok) {
            return result;
        }
        if (this.next) {
            return this.next.handle(payload);
        }
        return { ok: true };
    }
}
exports.ValidationHandler = ValidationHandler;
class RequiredFieldsValidator extends ValidationHandler {
    validate(payload) {
        if (!payload.name || !payload.phone || !payload.origin || !payload.vehicle) {
            return { ok: false, message: "Campos obrigatorios ausentes" };
        }
        return { ok: true };
    }
}
exports.RequiredFieldsValidator = RequiredFieldsValidator;
class PhoneValidator extends ValidationHandler {
    validate(payload) {
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
exports.PhoneValidator = PhoneValidator;
class OriginValidator extends ValidationHandler {
    allowed = [
        "visita presencial",
        "telefone",
        "WhatsApp",
        "Instagram",
    ];
    validate(payload) {
        if (!payload.origin) {
            return { ok: true };
        }
        if (!this.allowed.includes(payload.origin)) {
            return { ok: false, message: "Origem invalida" };
        }
        return { ok: true };
    }
}
exports.OriginValidator = OriginValidator;
class OutcomeValidator extends ValidationHandler {
    validate(payload) {
        if (!payload.outcome) {
            return { ok: false, message: "Outcome obrigatorio" };
        }
        if (payload.outcome !== "sale" && payload.outcome !== "no_sale") {
            return { ok: false, message: "Outcome invalido" };
        }
        return { ok: true };
    }
}
exports.OutcomeValidator = OutcomeValidator;
