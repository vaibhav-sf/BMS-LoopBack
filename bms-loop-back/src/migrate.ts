import 'dotenv/config';
import {BmsLoopBackApplication} from './application';
import {DbDataSource, validateDbConfig} from './datasources/db.datasource';

export async function migrate(args: string[]) {
  if (args.includes('--rebuild')) {
    throw new Error(
      'The destructive --rebuild migration option is disabled. Use a dedicated database and an explicit backup/restore plan for a rebuild.',
    );
  }
  validateDbConfig();
  console.log('Migrating schemas (alter existing schema)');

  const app = new BmsLoopBackApplication();
  await app.boot();
  // Register referenced tables before `books` so fresh-schema migration can
  // create its foreign keys without depending on asynchronous repo boot order.
  await app.get('repositories.AuthorRepository');
  await app.get('repositories.CategoryRepository');
  await app.get('repositories.BookRepository');
  await app.migrateSchema({existingSchema: 'alter'});

  const db = await app.get<DbDataSource>('datasources.db');
  await db.execute(
    'ALTER TABLE "authors" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP',
  );
  await db.execute(
    'ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP',
  );
  await db.execute(
    'ALTER TABLE "books" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP',
  );

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
