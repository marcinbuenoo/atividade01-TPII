"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
class Subject {
    observers = [];
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        this.observers = this.observers.filter((item) => item !== observer);
    }
    notify(event) {
        for (const observer of this.observers) {
            observer.update(event);
        }
    }
}
exports.Subject = Subject;
