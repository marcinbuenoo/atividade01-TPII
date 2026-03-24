export interface LeadEvent {
  leadId: string;
  type: "STAGE_CHANGED" | "STATUS_CHANGED" | "LEAD_CREATED";
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface Observer<T> {
  update(event: T): void;
}

// Observer: Subject gerencia inscritos e notifica eventos
export class Subject<T> {
  private observers: Observer<T>[] = [];

  attach(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  detach(observer: Observer<T>): void {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(event: T): void {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }
}
