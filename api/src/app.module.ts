import { Module } from '@nestjs/common';
import { GridModule } from './grid/grid.module';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GridModule,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
