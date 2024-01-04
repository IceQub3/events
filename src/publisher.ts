import type { Subscriber, Topic } from "./topic";


/**
 * @public
 */
export class Publisher<Arguments extends any[], ThisConstraint = {} | undefined> implements Topic<Arguments, ThisConstraint> {
    private freeSubscribers = new Set<Subscriber<Arguments, undefined>>();
    private boundSubscribers = new Map<unknown, Set<Subscriber<Arguments, ThisConstraint | undefined>>>()

    constructor(
        private readonly options: {
            handleError?(error: unknown, context?: unknown): void
        }
    ) {
        
    }
    
    subscribe<ThisArgument extends ThisConstraint = undefined extends ThisConstraint ? undefined : never>(
        subscriber: Subscriber<Arguments, ThisArgument>,
        context?: ThisArgument
    ): void {
        (context ? this.getOrMakeBoundSet(context) : this.freeSubscribers).add((subscriber as Subscriber<Arguments, ThisConstraint | undefined>));
    }

    unsubscribe<Context>(
        subscriber: Subscriber<Arguments, Context>,
        context?: Context
    ): void {
        (context ? this.boundSubscribers.get(context) : this.freeSubscribers)?.delete((subscriber as Subscriber<Arguments, unknown>));
    }
    
    emit(...args: Arguments): void {
        for (const subscriber of this.freeSubscribers) {
            try {
                subscriber.apply(undefined, args);
            } catch(error: unknown) {
                this.options.handleError?.call(undefined, error);
            }
        }

        for (const [context, subscribers] of this.boundSubscribers) {
            for (const subscriber of subscribers) {
                try {
                    subscriber.apply(context as ThisConstraint, args);
                } catch (error: unknown) {
                    this.options.handleError?.call(undefined, error, context);
                }
            }
        }
    }

    private getOrMakeBoundSet(context: unknown) {
        let set = this.boundSubscribers.get(context);

        if (!set) {
            set = new Set();
            this.boundSubscribers.set(context, set);
        }

        return set;
    }
}