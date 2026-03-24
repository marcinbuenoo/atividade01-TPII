"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadOriginFactory = void 0;
class InPersonOrigin {
    value = "visita presencial";
    describe() {
        return "Lead criada por visita presencial";
    }
}
class PhoneOrigin {
    value = "telefone";
    describe() {
        return "Lead criada por telefone";
    }
}
class WhatsAppOrigin {
    value = "WhatsApp";
    describe() {
        return "Lead criada por WhatsApp";
    }
}
class InstagramOrigin {
    value = "Instagram";
    describe() {
        return "Lead criada por Instagram";
    }
}
class LeadOriginFactory {
    static create(origin) {
        switch (origin) {
            case "visita presencial":
                return new InPersonOrigin();
            case "telefone":
                return new PhoneOrigin();
            case "WhatsApp":
                return new WhatsAppOrigin();
            case "Instagram":
                return new InstagramOrigin();
            default:
                return new InPersonOrigin();
        }
    }
}
exports.LeadOriginFactory = LeadOriginFactory;
