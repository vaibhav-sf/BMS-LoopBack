import {injectable, Provider} from '@loopback/core';

/**
 * A custom provider that supplies a timestamp factory.
 *
 * `value()` returns a function so the timestamp is evaluated at call time
 * (not once at injection time). Anything in the app can receive this via
 * dependency injection using the `providers.timestamp` binding key.
 */
@injectable()
export class TimestampProvider implements Provider<() => string> {
  value(): () => string {
    return () => new Date().toISOString();
  }
}
