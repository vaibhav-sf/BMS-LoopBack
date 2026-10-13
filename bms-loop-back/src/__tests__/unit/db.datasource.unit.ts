import {expect} from '@loopback/testlab';
import {validateDbConfig} from '../../datasources/db.datasource';

describe('PostgreSQL datasource configuration', () => {
  it('reports missing required variables clearly', () => {
    expect(() => validateDbConfig({})).to.throw(
      /DB_HOST, DB_USER, DB_PASSWORD, DB_NAME/,
    );
  });

  it('rejects invalid port values', () => {
    expect(() =>
      validateDbConfig({
        DB_HOST: 'localhost',
        DB_USER: 'test-user',
        DB_PASSWORD: 'test-password',
        DB_NAME: 'test-database',
        DB_PORT: 'not-a-port',
      }),
    ).to.throw(/DB_PORT must be an integer/);
  });
});
