import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Author} from './author.model';
import {Category} from './category.model';

@model({
  settings: {
    postgresql: {
      table: 'books',
    },
    indexes: {
      books_book_isbn_key: {
        keys: {book_isbn: 1},
        options: {unique: true},
      },
      idx_author_id: {
        keys: {author_id: 1},
      },
      idx_category_id: {
        keys: {category_id: 1},
      },
    },
    foreignKeys: {
      books_author_id_fkey: {
        name: 'books_author_id_fkey',
        entity: 'Author',
        entityKey: 'author_id',
        foreignKey: 'author_id',
        onDelete: 'RESTRICT',
      },
      books_category_id_fkey: {
        name: 'books_category_id_fkey',
        entity: 'Category',
        entityKey: 'category_id',
        foreignKey: 'category_id',
        onDelete: 'RESTRICT',
      },
    },
  },
})
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  book_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^[0-9]{10}$',
    },
  })
  book_isbn: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      type: 'integer',
      minimum: 1,
      maximum: 2026,
    },
  })
  published_year: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['printed book', 'ebook'],
    },
  })
  book_type: string;

  @property({
    type: 'number',
    jsonSchema: {
      type: 'integer',
      minimum: 1,
      nullable: true,
    },
  })
  page_count?: number;

  @property({
    type: 'number',
    postgresql: {dataType: 'NUMERIC'},
    jsonSchema: {
      nullable: true,
      exclusiveMinimum: 0,
    },
  })
  file_size?: number;

  @belongsTo(
    () => Author,
    {
      name: 'author',
      keyFrom: 'author_id',
      keyTo: 'author_id',
    },
    {
      type: 'number',
      required: true,
      jsonSchema: {
        type: 'integer',
        minimum: 1,
      },
    },
  )
  author_id: number;

  @belongsTo(
    () => Category,
    {
      name: 'category',
      keyFrom: 'category_id',
      keyTo: 'category_id',
    },
    {
      type: 'number',
      required: true,
      jsonSchema: {
        type: 'integer',
        minimum: 1,
      },
    },
  )
  category_id: number;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {dataType: 'TIMESTAMP WITHOUT TIME ZONE'},
  })
  created_at?: Date;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  author?: Author;
  category?: Category;
}

export type BookWithRelations = Book & BookRelations;
