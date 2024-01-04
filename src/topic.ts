

export type Subscriber<
    Arguments extends any[],
    ThisArgument = undefined
> = (this: ThisArgument, ...args: Arguments) => void | PromiseLike<void>;

/**
 * A topic of events
 */
export interface Topic<Arguments extends any[], ThisConstraint = {} | undefined> {
    subscribe<ThisArgument extends ThisConstraint = undefined extends ThisConstraint ? undefined : never>(
        subscriber: Subscriber<Arguments, ThisArgument>,
        context?: ThisArgument
    ): void;

    unsubscribe(listener: Subscriber<Arguments, any>): void
}