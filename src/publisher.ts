import type { Subscriber, Topic } from "./topic";


/**
 * @public
 */
export class Publisher<Arguments extends any[], ThisConstraint = {} | undefined> implements Topic<Arguments, ThisConstraint> {
    private listeners = new Set<Subscriber<Arguments, ThisConstraint | undefined>>();
    private contexties = new WeakMap<Subscriber<Arguments, ThisConstraint | undefined>, ThisConstraint>();

    constructor(
        private readonly options: {
            handleError?(error: unknown, context?: unknown): void
        }
    ) {
        
    }
    
    subscribe<ThisArgument extends ThisConstraint = undefined extends ThisConstraint ? undefined : never>(
        subscriber: Subscriber<Arguments, ThisArgument | undefined>,
        context?: ThisArgument
    ): void {
        const sub = subscriber as Subscriber<Arguments, ThisConstraint | undefined>;
        this.listeners.add(sub);
        context && this.contexties.set(sub, context);
    }

    unsubscribe(listener: Subscriber<Arguments, any>): void {
        this.listeners.delete(listener);
    }
    
    emit(...args: Arguments): void {
        for (const listener of this.listeners) {
            const context = this.contexties.get(listener);
            try {
                listener.apply(
                    context,
                    args
                );
            } catch(error: unknown) {
                this.options.handleError?.call(undefined, error, context);
            }
        }
    }
}