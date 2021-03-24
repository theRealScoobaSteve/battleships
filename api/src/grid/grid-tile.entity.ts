import { 
    Index, 
    Entity, 
    Column, 
    OneToOne,
    ManyToOne,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Grid } from './grid.entity';
import { Event } from './event.entity';

@Entity("grid_tile")
export class GridTile {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Grid, grid => grid.gridTiles)
    grid: Grid;

    @ManyToOne((type) => Event, event => event.gridTile, {
        eager: true
    })
    event: Event;

    @Index()
    @Column({ name: "x_coord" })
    xCoord: number;

    @Index()
    @Column({ name: "y_coord" })
    yCoord: number;
}