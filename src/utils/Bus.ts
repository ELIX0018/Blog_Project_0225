//发布订阅
// @ts-ignore
import mitt, { Emitter } from 'mitt';

class EventBus {
    private emitter: Emitter<any>;

    constructor() {
        this.emitter = mitt();
    }

    public on(event: string, handler: (...args: any[]) => void) {
        this.emitter.on(event, handler);
    }

    public off(event: string, handler: (...args: any[]) => void) {
        this.emitter.off(event, handler);
    }

    public emit(event: string, ...args: any[]) {
        // @ts-ignore
        this.emitter.emit(event, ...args);
    }
}

export const Bus = new EventBus();
