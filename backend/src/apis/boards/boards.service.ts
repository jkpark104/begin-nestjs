import { Injectable } from '@nestjs/common';
import type Board from './entities/board.entity';
import { IBoardsServiceCreate } from './interfaces/boards-service.interface';

@Injectable()
export class BoardsService {
  findAll(): Board[] {
    const result = [
      {
        number: 1,
        writer: '철수',
        title: '제목입니다~~',
        contents: '내용이에요!!!',
      },
      {
        number: 2,
        writer: '영희',
        title: '영희입니다~~',
        contents: '영희이에요!!!',
      },
      {
        number: 3,
        writer: '훈이',
        title: '훈이입니다~~',
        contents: '훈이이에요!!!',
      },
    ];

    return result;
  }

  create({ createBoardInput }: IBoardsServiceCreate): string {
    console.log(createBoardInput);

    return '게시물 등록에 성공했습니다.';
  }
}
