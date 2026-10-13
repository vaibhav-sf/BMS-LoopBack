import {Entity, model, property, hasMany} from '@loopback/repository';
import {Book} from './book.model';

@model({
  settings: {
    postgresql: {
      table: 'authors',
    },
    indexes: {
      authors_author_email_key: {
        keys: {author_email: 1},
        options: {unique: true},
      },
    },
  },
})
export class Author extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  author_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  last_name: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
  })
  author_email: string;

  @property({
    type: 'string',
    required: true,
  })
  author_country: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {dataType: 'TIMESTAMP WITHOUT TIME ZONE'},
  })
  created_at?: Date;

  @hasMany(() => Book, {keyTo: 'author_id'})
  books: Book[];

  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  // describe navigational properties here
}

export type AuthorWithRelations = Author & AuthorRelations;
