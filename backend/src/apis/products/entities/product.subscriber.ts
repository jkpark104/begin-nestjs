import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  afterInsert(event: InsertEvent<Product>) {
    console.log(event);
    // const { id, name, description, price, isSoldOut } = event.entity; //  빅쿼리나 엘라스틱서치에 담기
    // 1. 트리거는 언제 사용하면 안 될까?
    // 트랜잭션으로 연결된 중요한 내용들
    // 2. 어떤 것들을 사용하면 좋을까?
    // 메인 로직에 큰 피해를 안 끼치는 로직들 (통계 계산하기, 로그 쌓아놓기)
  }
}
