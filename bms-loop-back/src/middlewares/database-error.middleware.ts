import {inject, injectable, Next, Provider} from '@loopback/core';
import {
  asMiddleware,
  HttpErrors,
  LogError,
  Middleware,
  MiddlewareContext,
  RestBindings,
  RestMiddlewareGroups,
} from '@loopback/rest';

interface PostgresError extends Error {
  code?: string;
  constraint?: string;
  detail?: string;
}

@injectable(
  asMiddleware({
    group: 'databaseError',
    upstreamGroups: RestMiddlewareGroups.SEND_RESPONSE,
    downstreamGroups: RestMiddlewareGroups.CORS,
  }),
)
export class DatabaseErrorMiddlewareProvider implements Provider<Middleware> {
  constructor(
    @inject(RestBindings.SequenceActions.LOG_ERROR)
    protected logError: LogError,
  ) {}

  value(): Middleware {
    const middleware: Middleware = async (
      ctx: MiddlewareContext,
      next: Next,
    ) => {
      try {
        return await next();
      } catch (err) {
        return this.handleError(ctx, err as PostgresError);
      }
    };

    return middleware;
  }

  handleError(context: MiddlewareContext, err: PostgresError): never {
    switch (err.code) {
      case '23505':
        this.logError(err, 409, context.request);

        if (err.constraint === 'books_book_isbn_key') {
          throw new HttpErrors.Conflict(
            'A book with this ISBN already exists.',
          );
        }

        throw new HttpErrors.Conflict(
          'A resource with the provided value already exists.',
        );

      case '23503':
        this.logError(err, 422, context.request);

        if (err.constraint === 'books_author_id_fkey') {
          throw new HttpErrors.UnprocessableEntity(
            'The referenced author does not exist.',
          );
        }

        if (err.constraint === 'books_category_id_fkey') {
          throw new HttpErrors.UnprocessableEntity(
            'The referenced category does not exist.',
          );
        }

        throw new HttpErrors.UnprocessableEntity(
          'The referenced resource does not exist.',
        );

      case '23514':
        this.logError(err, 422, context.request);

        throw new HttpErrors.UnprocessableEntity(
          'The provided book data violates a database constraint.',
        );

      case '23502':
        this.logError(err, 422, context.request);

        throw new HttpErrors.UnprocessableEntity(
          'A required database field is missing.',
        );

      default:
        this.logError(err, 500, context.request);
        throw err;
    }
  }
}
