import type { Subscriber, Topic } from "./topic";

/**
 * @public
 */
export class Publisher<Arguments extends any[]> implements Topic<Arguments> {
  private subscribers = new Set<Subscriber<Arguments>>();

  constructor(
    private readonly options: {
      handleError?(error: unknown, context?: unknown): void;
    },
  ) {}

  subscribe(subscriber: Subscriber<Arguments>): void {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: Subscriber<Arguments>): void {
    this.subscribers.delete(subscriber);
  }

  emit(...args: Arguments): void {
    for (const subscriber of this.subscribers) {
      try {
        subscriber.apply(undefined, args);
      } catch (error: unknown) {
        this.options.handleError?.call(undefined, error);
      }
    }
  }
}
