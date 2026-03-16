import { LeadEvent, Observer } from "./observer";

export class ConsoleAuditObserver implements Observer<LeadEvent> {
  update(event: LeadEvent): void {
    // Simple audit log for demo purposes
    // eslint-disable-next-line no-console
    console.log(`[AUDIT] ${event.occurredAt} ${event.type}`, event.payload);
  }
}
