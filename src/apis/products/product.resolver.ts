import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    // 1. 등록된 내용이 담긴 객체를 그대로 브라우저에게 보내준다.
    return this.productsService.create({ createProductInput });

    // 2. 결과메세지만 간단히 보내준다.
    // return '정상적으로 등록되었습니다.';
  }
}
