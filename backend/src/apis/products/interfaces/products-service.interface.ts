import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../entities/product.entity';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
}

export interface IProductServiceFindOne {
  productId: string;
}

export interface IProductServiceUpdate {
  productId: string;
  updateProductInput: UpdateProductInput;
}

export interface IProductsServiceCheckSoldOut {
  product: Product;
}

export interface IProductsServiceDelete {
  productId: string;
}
