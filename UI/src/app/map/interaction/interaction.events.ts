interface ILiteEvent<T> {
    //on(handler: { (data?: T): void }) : void;
    off(handler: { (data?: T): void }) : void;
}

class LiteEvent<T> implements ILiteEvent<T> {

    public interactionInstance: any;
    constructor(private type: any) {
      this.interactionInstance = activator<T>(type) ;
    }
    private handlers: { (data?: T): void; }[] = [];

    public on(type, listener) {
        this.interactionInstance.on(type, listener);
    }

    // public on(handler: { (data?: T): void }) : void {
    //     this.handlers.push(handler);
    // }

    public off(handler: { (data?: T): void }) : void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data?: T) {
        this.handlers.slice(0).forEach(h => h(data));
	}

	// public expose() : ILiteEvent<T> {
	// 	return this;
	// }
}

function activator<T>(type: { new(): T ;} ): T {
    return new type();
}