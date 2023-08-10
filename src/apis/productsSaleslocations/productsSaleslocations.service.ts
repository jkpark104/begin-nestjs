import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSaleslocation } from './entities/productSalesLocation.entity';
import { IProductsSaleslocationServiceCreate } from './interfaces/products-saleslocations.interface';

@Injectable()
export class ProductsSaleslocationsService {
  constructor(
    @InjectRepository(ProductSaleslocation)
    private readonly productsSaleslocationsRepository: Repository<ProductSaleslocation>,
  ) {}

  create({ productsSaleslocation }: IProductsSaleslocationServiceCreate) {
    return this.productsSaleslocationsRepository.save({
      ...productsSaleslocation,
    });
  }
}
