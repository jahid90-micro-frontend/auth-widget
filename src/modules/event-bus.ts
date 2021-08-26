class EventBusImpl {

    listeners: Record<string, Array<(data: any) => void>>;

    constructor() {
        this.listeners = {};
    }

    on(event: string, cb: (data: any) => void) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(cb);
    }

    off(event: string, cb: (data: any) => void) {
        if (this.listeners[event]) {
            const idx = this.listeners[event].indexOf(cb);
            idx !== -1 && this.listeners[event].splice(idx, 1);
        }
    }

    emit(event: string, data?: any) {
        this.listeners[event] && this.listeners[event].forEach(cb => {
            cb(data);
        })
    }

}

// share a single instance across the app
export const EventBus = new EventBusImpl();
