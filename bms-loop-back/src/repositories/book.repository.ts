import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {DbDataSource} from '../datasources';
import {Author, Book, BookRelations, Category} from '../models';
import {AuthorRepository} from './author.repository';
import {CategoryRepository} from './category.repository';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.book_id,
  BookRelations
> {
  public readonly author: BelongsToAccessor<
    Author,
    typeof Book.prototype.book_id
  >;

  public readonly category: BelongsToAccessor<
    Category,
    typeof Book.prototype.book_id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('AuthorRepository')
    authorRepositoryGetter: Getter<AuthorRepository>,

    @repository.getter('CategoryRepository')
    categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Book, dataSource);

    this.author = this.createBelongsToAccessorFor(
      'author',
      authorRepositoryGetter,
    );

    this.registerInclusionResolver('author', this.author.inclusionResolver);

    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );

    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
