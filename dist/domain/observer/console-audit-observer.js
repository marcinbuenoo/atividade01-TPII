"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleAuditObserver = void 0;
class ConsoleAuditObserver {
    update(event) {
        // Simple audit log for demo purposes
        // eslint-disable-next-line no-console
        console.log(`[AUDIT] ${event.occurredAt} ${event.type}`, event.payload);
    }
}
exports.ConsoleAuditObserver = ConsoleAuditObserver;
