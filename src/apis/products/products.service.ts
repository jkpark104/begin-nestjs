import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductServiceFindOne,
  IProductServiceUpdate,
  IProductsServiceCheckSoldOut,
  IProductsServiceCreate,
} from './interfaces/products-service.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne({ productId }: IProductServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({ where: { id: productId } });
  }

  create({ createProductInput }: IProductsServiceCreate): Promise<Product> {
    const result = this.productsRepository.save({
      ...createProductInput,
    });

    // await 해주지 않아도 브라우저에게 보내기 전에 자동으로 await 해준다.
    // nest만 해당 기능을 제공한다. express는 제공하지 않는다.

    return result;
  }

  async update({
    productId,
    updateProductInput,
  }: IProductServiceUpdate): Promise<Product> {
    // 기존 있는 내용을 재사용하여, 로직을 통일시킨다.
    const product = await this.findOne({ productId });

    // 검증은 서비스에서 한다.
    this.checkSoldOut({ product });

    const result = this.productsRepository.save({
      ...product, // 수정 후, 수정되지 않은 다른 결과값까지 모두 객체로 반환하고 싶다면, ...product을 사용한다.
      ...updateProductInput,
    });
    // id: productId, // id가 있으면 update, 없으면 create로 동작한다.

    // save이외에 create, insert, update, delete 등의 메서드는 반환값이 없다.
    // create는 db에 저장하지 않고, 객체만 생성한다.
    return result;
  }

  // 1. checkSoldOut을 메서드로 만드는 이유 => 수정 시 삭제 시 등 같은 검증 로직 사용
  checkSoldOut({ product }: IProductsServiceCheckSoldOut): void {
    // if (product.isSoldOut) {
    //   throw new HttpException(
    //     '이미 판매된 상품입니다.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }

    if (product.isSoldOut) {
      throw new UnprocessableEntityException('이미 판매된 상품입니다.');
    }
  }
}
