import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Category, CategoryRelations, Book} from '../models';
import {BookRepository} from './book.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.category_id,
  CategoryRelations
> {
  public readonly books: HasManyRepositoryFactory<
    Book,
    typeof Category.prototype.category_id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('BookRepository')
    bookRepositoryGetter: Getter<BookRepository>,
  ) {
    super(Category, dataSource);

    this.books = this.createHasManyRepositoryFactoryFor(
      'books',
      bookRepositoryGetter,
    );

    this.registerInclusionResolver('books', this.books.inclusionResolver);
  }
}
