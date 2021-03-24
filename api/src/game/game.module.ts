import { Module } from '@nestjs/common';
import { Player } from './player.entity';
import { Grid } from 'src/grid/grid.entity';
import { GameGateway } from './game.gateway';
import { GridService } from './grid.service';
import { Event } from '../grid/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GridTile } from '../grid/grid-tile.entity';
import { PlayerRepository } from './player.repository';
import { GridTileRepository } from './grid-tile.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Grid, 
      Event,
      Player, 
      GridTile,
      PlayerRepository,
      GridTileRepository
    ])
  ],
  providers: [
    GameGateway, 
    GridService, 
  ],
  controllers: []
})
export class GameModule {}
