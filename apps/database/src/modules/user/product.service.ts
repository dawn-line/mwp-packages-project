import { Injectable } from '@nestjs/common';
import { InjectRepository, BaseRepository } from '@cs/nest-typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  @InjectRepository(ProductEntity, 'test')
  private readonly productRepository: BaseRepository<ProductEntity>;
  async getProductById(id: string): Promise<UserEntity> {
    return this.productRepository.find({ id, isRemoved: false });
  }
}
