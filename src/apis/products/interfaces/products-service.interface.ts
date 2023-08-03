import { CreateProductInput } from '../dto/create-product.input';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
}

export interface IProductServiceFindOne {
  productId: string;
}
