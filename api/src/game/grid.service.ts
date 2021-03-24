import { Player } from './player.entity';
import { Not, Repository } from 'typeorm';
import { FireEvent } from './game.gateway';
import { Grid } from '../grid/grid.entity';
import { Injectable } from '@nestjs/common';
import { Event } from "../grid/event.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { GridTile } from '../grid/grid-tile.entity';
import { PlayerRepository } from './player.repository';
import { GridTileRepository } from './grid-tile.repository';

const shipData = [
    6,
    5,
    4,
    3,
    2
];

@Injectable()
export class GridService {
    private gridHeight: number = 12;
    
    private gridWidth: number = 12;

    private maxShipHeight: number = 11;

    constructor(
        @InjectRepository(Grid)
        private gridRepository: Repository<Grid>,
        private playerRepository: PlayerRepository,
        private gridTileRepository: GridTileRepository,
        @InjectRepository(Event)
        private eventRepository: Repository<Event>
    ) {}
    /**
     * @method generatePlayerGrids
     * @param userId : string
     * @returns Promise<Player>
     */
    public async generatePlayerGrids(userId: string): Promise<Player> {
        const targetGrid = await this.generateGrid();
        
        const player = new Player();

        player.socketId = userId;
        player.targetGrid = targetGrid;
        
        await this.playerRepository.save(player);

        return player;
    }

    /**
     * @method handleDisconnect
     * @param userId : string
     * @return Promise<void>
     */
    public async handleDisconnect(userId: string) : Promise<void> {
        const player = await this.playerRepository.findOne({
            "socketId": userId
        });
        
        if (player) {
            await this.playerRepository.delete(player);
        }
    }

    /**
     * This function is rather clunky and should be made easier to read
     * as well as optimized for ship generation
     * 
     * @method addShips
     * @param player : string 
     * @returns Promise<Player>
     */
    public async addShips(player: Player): Promise<Player> {
        return new Promise(async (res, rej) => {
            let shipGrid: Grid = await this.generateGrid();
            const shipEvent: Event = await this.eventRepository.findOne({
                machineName: "ship"
            });
            
            for (const shipLength of shipData) {
                // get my random coordinates
                const isHorizontal = Math.floor(Math.random() * Math.floor(2));
                const xCoord = Math.floor(Math.random() * Math.floor(this.maxShipHeight));
                const yCoord = Math.floor(Math.random() * Math.floor(this.maxShipHeight));

                // if the ship is horizontal
                if (isHorizontal === 1) {
                    // if the ship doesn't fit based on where its being placed
                    if (xCoord + shipLength > this.maxShipHeight) {
                        // count down from its current x coordinate
                        for (let i = xCoord; i !== xCoord - shipLength; --i) {
                            // find the coordinate to add a ship point
                            const gridTile = shipGrid.gridTiles.find((gridTile: GridTile) => {
                                return gridTile.xCoord === i && gridTile.yCoord === yCoord;
                            });

                            await this.gridTileRepository.saveWithEvent(gridTile, shipEvent);
                        }
                    } else {
                        // count up from its current location
                        for (let i = xCoord; i < shipLength + xCoord; ++i) {
                            // find the coordinate to add a ship point
                            const gridTile = shipGrid.gridTiles.find((gridTile: GridTile) => {
                                return gridTile.xCoord === i && gridTile.yCoord === yCoord;
                            });
                            
                            await this.gridTileRepository.saveWithEvent(gridTile, shipEvent);
                        }
                    }
                } else {
                    if (yCoord + shipLength > this.maxShipHeight) {
                        for (let i = yCoord; i !== yCoord - shipLength; --i) {
                            const gridTile = shipGrid.gridTiles.find((gridTile: GridTile) => {
                                return gridTile.yCoord === i && gridTile.xCoord === xCoord;
                            });

                            await this.gridTileRepository.saveWithEvent(gridTile, shipEvent);
                        }
                    } else {
                        for (let i = yCoord; i < yCoord + shipLength; ++i) {
                            const gridTile = shipGrid.gridTiles.find((gridTile: GridTile) => {
                                return gridTile.yCoord === i && gridTile.xCoord === xCoord;
                            });

                            await this.gridTileRepository.saveWithEvent(gridTile, shipEvent);
                        }
                    }
                }
            }

            await this.gridRepository.save(shipGrid);
            
            player.shipGrid = shipGrid;

            await this.playerRepository.save(player);

            res(player);
        });
    }

    /**
     * @method fireEvent
     * @param event : FireEvent 
     * @param enemyId : string
     * @param playerId : string
     * @return Promise<void>
     */
    public async fireEvent(
        event: FireEvent, 
        enemyId: string,
        playerId: string
    ): Promise<void> {
        const enemyTile = await this.gridTileRepository.getPlayerShipTile(
            event,
            enemyId
        );
        
        await this.updateTile(enemyTile);
        
        const playerTile = await this.gridTileRepository.getPlayerTargetTile(
            event,
            playerId
        );

        playerTile.event = enemyTile.event;

        await this.gridTileRepository.save(playerTile);
    }

    /**
     * @method updateTile
     * @param tile : GridTile
     * @return Promise<void>
     */
    private async updateTile(tile: GridTile): Promise<void> {
        const shipSpot = await this.eventRepository.findOne({
            machineName: "ship"
        });
        
        if (tile.event.machineName === shipSpot.machineName) {
            const hit = await this.eventRepository.findOne({
                machineName: "hit"
            });

            tile.event = hit;
        } else {
            const miss = await this.eventRepository.findOne({
                machineName: "miss"
            });

            tile.event = miss;
        }
        
        await this.gridTileRepository.save(tile);
    }

    /**
     * @method checkWin
     * @param socketId : string
     * @returns Promise<boolean>
     */
    public async checkWin(socketId: string): Promise<boolean> {
        const count = await this.gridTileRepository.getWinCondition(socketId)
            
        return count === 0;
    }

    /**
     * @method generateGrid
     * @returns Promise<Grid>
     */
    private async generateGrid(): Promise<Grid> {
        const grid: Grid = new Grid();
        const tiles: Array<GridTile> = [];

        const event = await this.eventRepository.findOne({
            "machineName": "empty"
        });

        for (let y = 0; y < this.gridHeight; ++y) {
            for (let x = 0; x < this.gridWidth; ++x) {
                const gridTile = new GridTile();

                gridTile.xCoord = x;
                gridTile.yCoord = y;

                gridTile.event = event;

                await this.gridTileRepository.save(gridTile);

                tiles.push(gridTile);
            }
        }
            
        grid.gridTiles = tiles;

        await this.gridRepository.save(grid);
        
        return grid;
    }
}
