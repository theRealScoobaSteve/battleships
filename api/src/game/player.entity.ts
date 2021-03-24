import { 
    Index, 
    Entity, 
    Column,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Grid } from '../grid/grid.entity';

@Entity("player")
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: "socket_id" })
    socketId: string;

    @ManyToOne(() => Grid, grid => grid.playerShip)
    shipGrid: Grid;

    @ManyToOne(() => Grid, grid => grid.playerTarget)
    targetGrid: Grid;

    @Column({ name: "is_players_turn", default: false })
    isPlayersTurn: boolean = false;
}