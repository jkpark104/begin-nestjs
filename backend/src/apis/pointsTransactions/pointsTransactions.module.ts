import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointsTransactionsResolver } from './pointsTransactions.resolver';
import { PointsTransactionsService } from './pointsTransactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointTransaction, User])],
  providers: [PointsTransactionsResolver, PointsTransactionsService],
})
export class PointsTransactionsModule {}
