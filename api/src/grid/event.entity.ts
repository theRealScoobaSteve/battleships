import { 
    Entity, 
    Column, 
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { GridTile } from './grid-tile.entity';

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "machine_name" })
    machineName: string;

    @OneToMany(() => GridTile, gridTile => gridTile.event)
    gridTile: GridTile[];
}