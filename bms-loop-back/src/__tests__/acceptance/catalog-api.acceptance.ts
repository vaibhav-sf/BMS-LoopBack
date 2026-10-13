/* eslint @typescript-eslint/naming-convention: off */
import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {BmsLoopBackApplication} from '../..';
import {Author, Book, Category} from '../../models';
import {
  AuthorRepository,
  BookRepository,
  CategoryRepository,
} from '../../repositories';

describe('Catalog create endpoints', () => {
  let app: BmsLoopBackApplication;
  let client: Client;

  before(async () => {
    app = new BmsLoopBackApplication({
      rest: givenHttpServerConfig(),
    });

    await app.boot();
    // RepositoriesBooter registers the actual repository classes during boot,
    // so replace those bindings after boot and before starting the REST server.
    app.unbind('repositories.AuthorRepository');
    app.bind('repositories.AuthorRepository').to({
      create: async (data: Partial<Author>) => ({
        ...data,
        author_id: 1,
        created_at: new Date(),
      }),
    } as unknown as AuthorRepository);
    app.unbind('repositories.CategoryRepository');
    app.bind('repositories.CategoryRepository').to({
      create: async (data: Partial<Category>) => ({
        ...data,
        category_id: 1,
        created_at: new Date(),
      }),
    } as unknown as CategoryRepository);
    app.unbind('repositories.BookRepository');
    app.bind('repositories.BookRepository').to({
      create: async (data: Partial<Book>) => ({
        ...data,
        book_id: 1,
        created_at: new Date(),
      }),
    } as unknown as BookRepository);
    await app.start();
    client = createRestAppClient(app);
  });

  after(async () => {
    await app.stop();
  });

  it('creates authors with HTTP 201 and validates author_email', async () => {
    const valid = await client
      .post('/authors')
      .send({
        first_name: 'Ava',
        last_name: 'Reader',
        author_email: 'ava@example.com',
        author_country: 'IN',
      })
      .expect(201);

    expect(valid.body.author_id).to.equal(1);
    expect(new Date(valid.body.created_at).getTime()).to.be.greaterThan(0);

    await client
      .post('/authors')
      .send({
        first_name: 'Ava',
        last_name: 'Reader',
        author_email: 'invalid-email',
        author_country: 'IN',
      })
      .expect(422);
  });

  it('creates categories with HTTP 201', async () => {
    const response = await client
      .post('/categories')
      .send({category_name: 'Fiction'})
      .expect(201);

    expect(response.body.category_id).to.equal(1);
    expect(new Date(response.body.created_at).getTime()).to.be.greaterThan(0);
  });

  it('creates books with HTTP 201', async () => {
    const response = await client
      .post('/books')
      .send({
        title: 'A Book',
        book_isbn: '1234567890',
        published_year: 2020,
        book_type: 'printed book',
        file_size: 0.01,
        author_id: 1,
        category_id: 1,
      })
      .expect(201);

    expect(response.body.book_id).to.equal(1);
    expect(new Date(response.body.created_at).getTime()).to.be.greaterThan(0);
  });

  it('rejects ISBN values that are not exactly ten digits', async () => {
    await client
      .post('/books')
      .send({
        title: 'A Book',
        book_isbn: '123456789',
        published_year: 2020,
        book_type: 'printed book',
        author_id: 1,
        category_id: 1,
      })
      .expect(422);
  });

  it('rejects client supplied generated IDs and timestamps', async () => {
    await client
      .post('/authors')
      .send({
        first_name: 'Ava',
        last_name: 'Reader',
        author_email: 'ava@example.com',
        author_country: 'IN',
        author_id: 42,
        created_at: '2000-01-01',
      })
      .expect(422);

    await client
      .post('/categories')
      .send({
        category_name: 'Fiction',
        category_id: 42,
        created_at: '2000-01-01',
      })
      .expect(422);

    await client
      .post('/books')
      .send({
        title: 'A Book',
        book_isbn: '1234567890',
        published_year: 2020,
        book_type: 'printed book',
        author_id: 1,
        category_id: 1,
        book_id: 42,
        created_at: '2000-01-01',
      })
      .expect(422);
  });
});
