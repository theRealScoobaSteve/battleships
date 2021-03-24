import { Event } from '../grid/event.entity';
import { GridTile } from '../grid/grid-tile.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FireEvent } from './game.gateway';

@EntityRepository(GridTile)
export class GridTileRepository extends Repository<GridTile> {
    async saveWithEvent(tile: GridTile, event: Event): Promise<void> {
        tile.event = event;

        await this.save(tile);
    }
    
    async getWinCondition(socketId: string): Promise<number> {
        return await this
            .createQueryBuilder('gridTile')
            .leftJoinAndSelect('gridTile.event', 'event')
            .leftJoinAndSelect('gridTile.grid', 'grid')
            .leftJoinAndSelect('grid.playerShip', 'playerShip')
            .leftJoinAndSelect('grid.playerTarget', 'playerGrid')
            .where('playerShip.socketId = :socketId', { socketId })
            .andWhere('event.machineName = :machineName', { machineName: "ship" })
            .getCount();
    }

    async getPlayerShipTile(
        { xCoord, yCoord }: FireEvent, 
        socketId: string
    ): Promise<GridTile> {
        return await this
            .createQueryBuilder('gridTile')
            .leftJoinAndSelect('gridTile.event', 'event')
            .leftJoin('gridTile.grid', 'grid')
            .leftJoin('grid.playerShip', 'playerShipGrid')
            .where('playerShipGrid.socketId = :socketId', { socketId })
            .andWhere('gridTile.xCoord = :xCoord', { xCoord })
            .andWhere('gridTile.yCoord = :yCoord', { yCoord })
            .getOne();
    }

    async getPlayerTargetTile(
        { xCoord, yCoord }: FireEvent, 
        socketId: string
    ): Promise<GridTile> {
        return await this
            .createQueryBuilder('gridTile')
            .leftJoinAndSelect('gridTile.event', 'event')
            .leftJoin('gridTile.grid', 'grid')
            .leftJoin('grid.playerTarget', 'playerTarget')
            .where('playerTarget.socketId = :socketId', { socketId })
            .andWhere('gridTile.xCoord = :xCoord', { xCoord })
            .andWhere('gridTile.yCoord = :yCoord', { yCoord })
            .getOne();
    }
}