import { IAuthUser } from 'src/common/interfaces/context';

export interface IPointsTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
}
