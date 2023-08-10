import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductServiceFindOne,
  IProductServiceUpdate,
  IProductsServiceCheckSoldOut,
  IProductsServiceCreate,
  IProductsServiceDelete,
} from './interfaces/products-service.interface';
import { ProductsSaleslocationsService } from '../productsSaleslocations/productsSaleslocations.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsSaleslocationsService: ProductsSaleslocationsService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productsSaleslocation', 'productCategory'],
    });
  }

  findOne({ productId }: IProductServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productsSaleslocation', 'productCategory'],
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    // 1. 상품 하나만 등록
    // const result = this.productsRepository.save({
    //   ...createProductInput,
    // });
    // // await 해주지 않아도 브라우저에게 보내기 전에 자동으로 await 해준다.
    // // nest만 해당 기능을 제공한다. express는 제공하지 않는다.
    // return result;
    // 2. 상품과 상품 거래 위치를 같이 등록

    const { productsSaleslocation, productCategoryId, ...product } =
      createProductInput;

    const result = await this.productsSaleslocationsService.create({
      productsSaleslocation: { ...productsSaleslocation },
    });
    // 서비스를 타고 가야 하는 이유는..?
    //  레파지토리에 직접 접근하면 검증 로직을 통일 시킬 수 없음

    const result2 = await this.productsRepository.save({
      ...product,
      productsSaleslocation: result,
      productCategory: {
        id: productCategoryId,
        // 만약에, name까지 받고 싶으면?
        //  => createProductInput에서 name까지 포함해서 받아야 한다.
      },
    });

    return result2;
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

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    // 1. 실제 삭제
    // const result = await this.productsRepository.delete({ id: productId });

    // return result.affected ? true : false;

    // 2. 소프트 삭제 - isDeleted
    // this.productsRepository.update({ id: productId }, { isDeleted: true });

    // 3. 소프트 삭제 - deletedAt
    // this.productsRepository.update(
    //   { id: productId },
    //   { deletedAt: new Date() },
    // );

    // 4. 소프트 삭제 - typeorm softRemove
    // this.productsRepository.softRemove({ id: productId });
    // 단점 : id로만 삭제 가능
    // 장점 : 여러 id를 배열로 받아서 삭제 가능

    // 5. 소프트 삭제 - typeorm softDelete
    // this.productsRepository.softDelete({ id: productId });
    // 단점: 여러 ID 한 번에 삭제 불가능
    // 장점: 다른 칼럼으로도 삭제ㅐ 가능

    const result = await this.productsRepository.softDelete({ id: productId });

    return result.affected ? true : false;
  }
}
