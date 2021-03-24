import { 
    Entity, 
    OneToMany,
    PrimaryGeneratedColumn 
} from "typeorm";
import { GridTile } from './grid-tile.entity';
import { Player } from '../game/player.entity';

@Entity("grid")
export class Grid {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => GridTile, gridTile => gridTile.grid)
    gridTiles: GridTile[];

    @OneToMany(() => Player, player => player.shipGrid)
    playerShip: Player[];

    @OneToMany(() => Player, player => player.targetGrid)
    playerTarget: Player[];
}