import { LeadEvent, Observer } from "./observer";

// Observer concreto: registra eventos no console
export class ConsoleAuditObserver implements Observer<LeadEvent> {
  update(event: LeadEvent): void {
    // Simple audit log for demo purposes
    console.log(`[AUDIT] ${event.occurredAt} ${event.type}`, event.payload);
  }
}
