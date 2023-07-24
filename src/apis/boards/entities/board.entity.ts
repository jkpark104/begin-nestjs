import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Board {
  @PrimaryGeneratedColumn('increment')
  number: number;

  @Column()
  writer: string;

  @Column()
  title: string;

  @Column()
  contents: string;
}

export default Board;
