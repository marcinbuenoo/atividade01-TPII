"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizadoState = exports.AguardandoPagamentoState = exports.AguardandoRespostaState = exports.EnviouPropostaState = exports.ContatoInicialState = void 0;
exports.stageStateFromName = stageStateFromName;
function stageStateFromName(name) {
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
class ContatoInicialState {
    name = "Contato inicial";
    advance(lead) {
        lead.setStage(new EnviouPropostaState());
        lead.setStatus("Em negociacao");
    }
    finalize(lead, outcome) {
        lead.finalizeOutcome(outcome);
    }
}
exports.ContatoInicialState = ContatoInicialState;
class EnviouPropostaState {
    name = "Enviou proposta";
    advance(lead) {
        lead.setStage(new AguardandoRespostaState());
    }
    finalize(lead, outcome) {
        lead.finalizeOutcome(outcome);
    }
}
exports.EnviouPropostaState = EnviouPropostaState;
class AguardandoRespostaState {
    name = "Aguardando resposta do cliente";
    advance(lead) {
        lead.setStage(new AguardandoPagamentoState());
    }
    finalize(lead, outcome) {
        lead.finalizeOutcome(outcome);
    }
}
exports.AguardandoRespostaState = AguardandoRespostaState;
class AguardandoPagamentoState {
    name = "Aguardando pagamento";
    advance(lead) {
        throw new Error("Lead ja esta aguardando pagamento");
    }
    finalize(lead, outcome) {
        lead.finalizeOutcome(outcome);
    }
}
exports.AguardandoPagamentoState = AguardandoPagamentoState;
class FinalizadoState {
    name = "Finalizado";
    advance() {
        throw new Error("Lead finalizada nao pode avancar");
    }
    finalize() {
        throw new Error("Lead finalizada nao pode mudar status");
    }
}
exports.FinalizadoState = FinalizadoState;
