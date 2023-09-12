import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  POINT_TRANSACTION_STATUS_ENUM,
  PointTransaction,
} from './entities/pointTransaction.entity';
import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    // create -> 등록을 위한 빈 객체 만들기
    // insert -> 결과를 못 받는 등록 방법
    // update -> 결과를 못 받는 수정 방법

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 1. PointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(pointTransaction);

      // 2. 유저의 돈 찾아오기
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id }, // row-lock
        lock: { mode: 'pessimistic_write' },
      });

      // 3. 유저의 돈 업데이트
      const updatedUser = this.usersRepository.create({
        ...user, // id가 있으면 업데이트, 없으면 새로 생성
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      // 4. 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new Error(error);
    } finally {
      await queryRunner.release();
      // release가 없으면, commit 끝나고 커넥션이 안 끊겨서 문제가 됨
      // error가 나면 커넥션 자동으로 끊어지는데, error가 안 나면 커넥션 끊어주는게 필요함
    }
  }
}
