import { LeadOriginName } from "../types";

export interface OriginChannel {
  value: LeadOriginName;
  describe(): string;
}

class InPersonOrigin implements OriginChannel {
  value: LeadOriginName = "visita presencial";
  describe(): string {
    return "Lead criada por visita presencial";
  }
}

class PhoneOrigin implements OriginChannel {
  value: LeadOriginName = "telefone";
  describe(): string {
    return "Lead criada por telefone";
  }
}

class WhatsAppOrigin implements OriginChannel {
  value: LeadOriginName = "WhatsApp";
  describe(): string {
    return "Lead criada por WhatsApp";
  }
}

class InstagramOrigin implements OriginChannel {
  value: LeadOriginName = "Instagram";
  describe(): string {
    return "Lead criada por Instagram";
  }
}

// Factory: cria o canal de origem correto
export class LeadOriginFactory {
  static create(origin: LeadOriginName): OriginChannel {
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
