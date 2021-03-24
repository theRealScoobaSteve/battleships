import { Player } from './player.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
    async getPlayerShipGrid(socketId: string): Promise<Player> {
        return await this
            .createQueryBuilder('player')
            .leftJoinAndSelect('player.shipGrid', 'shipGrid')
            .leftJoinAndSelect('shipGrid.gridTiles', 'shipTiles')
            .leftJoinAndSelect('shipTiles.event', 'shipEvent')
            .leftJoinAndSelect('player.targetGrid', 'targetGrid')
            .leftJoinAndSelect('targetGrid.gridTiles', 'targetTiles')
            .leftJoinAndSelect('targetTiles.event', 'targetEvent')
            .where('player.socketId = :socketId', { socketId })
            .getOne();
    }
}