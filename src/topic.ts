/**
 * @public
 */
export type Subscriber<Arguments extends any[]> = (
  ...args: Arguments
) => void | PromiseLike<void>;

/**
 * @public
 * A topic of events
 */
export interface Topic<Arguments extends any[]> {
  subscribe(subscriber: Subscriber<Arguments>): void;
  unsubscribe(listener: Subscriber<Arguments>): void;
}
