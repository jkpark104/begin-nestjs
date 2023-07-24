import { BoardsService } from './boards.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  @Query(() => String, { nullable: true })
  getHello(): string {
    return this.boardsService.qqq();
  }
}
