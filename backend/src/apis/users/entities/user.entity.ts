import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType() // 리턴 타입으로 사용할 수 있도록 ObjectType 데코레이터를 추가
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) 비밀번호는 브라우저에 노출되면 안 되므로 필드에서 제외
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  age: number;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;
}
