import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}

// PickType을 사용하면, create-product.input.ts에서 정의한 필드 중 일부만 사용할 수 있다.
// OmitType을 사용하면, create-product.input.ts에서 정의한 필드 중 일부를 제외하고 사용할 수 있다.
// PartialType을 사용하면, create-product.input.ts에서 정의한 필드 중 일부만 사용할 수 있다.
