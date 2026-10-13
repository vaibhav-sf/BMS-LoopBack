import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const REQUIRED_DB_ENV_VARS = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
] as const;

export function validateDbConfig(env: NodeJS.ProcessEnv = process.env): void {
  const missing = REQUIRED_DB_ENV_VARS.filter(key => !env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required PostgreSQL configuration: ${missing.join(', ')}. ` +
        'Set these variables in the environment or in bms-loop-back/.env.',
    );
  }

  const port = Number(env.DB_PORT ?? 5432);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT must be an integer between 1 and 65535.');
  }
}

const config = {
  name: 'db',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
