import {expect} from '@loopback/testlab';
import {MiddlewareContext} from '@loopback/rest';
import {DatabaseErrorMiddlewareProvider} from '../../middlewares/database-error.middleware';

describe('DatabaseErrorMiddlewareProvider', () => {
  const provider = new DatabaseErrorMiddlewareProvider(() => {});
  const context = {request: {}} as MiddlewareContext;

  function postgresError(
    code: string,
    constraint?: string,
  ): Error & {
    code: string;
    constraint?: string;
  } {
    return Object.assign(new Error('private database detail'), {
      code,
      constraint,
    });
  }

  function captureError(action: () => never): Error & {statusCode?: number} {
    try {
      action();
    } catch (err) {
      return err as Error & {statusCode?: number};
    }
    throw new Error('Expected database error middleware to throw.');
  }

  it('maps duplicate ISBN constraints to a sanitized 409 response', () => {
    const err = captureError(() =>
      provider.handleError(
        context,
        postgresError('23505', 'books_book_isbn_key'),
      ),
    );
    expect(err.message).to.match(/ISBN already exists/);
    expect(err.statusCode).to.equal(409);
  });

  it('maps duplicate category names to 409 responses', () => {
    const err = captureError(() =>
      provider.handleError(
        context,
        postgresError('23505', 'categories_category_name_key'),
      ),
    );
    expect(err.message).to.match(/category with this name already exists/);
    expect(err.statusCode).to.equal(409);
  });

  it('maps nonexistent author and category references to 422 responses', () => {
    const authorErr = captureError(() =>
      provider.handleError(
        context,
        postgresError('23503', 'books_author_id_fkey'),
      ),
    );
    expect(authorErr.message).to.match(/author does not exist/);
    expect(authorErr.statusCode).to.equal(422);

    const categoryErr = captureError(() =>
      provider.handleError(
        context,
        postgresError('23503', 'books_category_id_fkey'),
      ),
    );
    expect(categoryErr.message).to.match(/category does not exist/);
    expect(categoryErr.statusCode).to.equal(422);
  });

  it('maps the existing file-size check without exposing database details', () => {
    const err = captureError(() =>
      provider.handleError(
        context,
        postgresError('23514', 'books_file_size_check'),
      ),
    );
    expect(err.message).to.match(/File size must be greater than zero/);
    expect(err.message).to.not.containEql('private database detail');
    expect(err.statusCode).to.equal(422);
  });

  it('maps database not-null violations to 422 responses', () => {
    const err = captureError(() =>
      provider.handleError(context, postgresError('23502')),
    );
    expect(err.message).to.match(/required database field is missing/);
    expect(err.statusCode).to.equal(422);
  });
});
