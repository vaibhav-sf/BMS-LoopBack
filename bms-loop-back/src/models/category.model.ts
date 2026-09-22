import {Entity, model, property, hasMany} from '@loopback/repository';
import {Book} from './book.model';

@model({
  settings: {
    postgresql: {
      table: 'categories',
    },
  },
})
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  category_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  category_name: string;

  @property({
    type: 'date',
  })
  created_at?: Date;
  @hasMany(() => Book, {keyTo: 'category_id'})
  books?: Book[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
