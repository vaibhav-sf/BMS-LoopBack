import {
  globalInterceptor,
  Interceptor,
  InvocationContext,
  Next,
  Provider,
} from '@loopback/core';

@globalInterceptor('', {tags: {name: 'log'}})
export class LogInterceptor implements Provider<Interceptor> {
  value(): Interceptor {
    return this.intercept.bind(this);
  }

  async intercept(invocationCtx: InvocationContext, next: Next) {
    const start = Date.now();
    console.log(`→ Invoking ${invocationCtx.targetName}`);
    try {
      const result = await next();
      console.log(
        `← ${invocationCtx.targetName} completed in ${Date.now() - start}ms`,
      );
      return result;
    } catch (err) {
      console.error(`✗ ${invocationCtx.targetName} failed: ${err.message}`);
      throw err;
    }
  }
}
