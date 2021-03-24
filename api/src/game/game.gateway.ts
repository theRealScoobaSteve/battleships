import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GridService } from './grid.service';
import { PlayerRepository } from './player.repository';

export interface FireEvent {
  xCoord: number;
  yCoord: number;
  enemyId: number;
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private connections = [];

  constructor(
    private gridService: GridService,
    private playerRepository: PlayerRepository,
  ) {}

  @SubscribeMessage('fire_event')
  async handleFireEvent(
    @MessageBody() event: FireEvent, 
    @ConnectedSocket() client: Socket
  ) {
      const enemyConn = this.connections.filter((conn: string) => conn !== client.id); 
      
      if (enemyConn.length === 1) {
        const enemySocketId = enemyConn.pop();
        await this.gridService.fireEvent(event, enemySocketId, client.id);

        const enemyPlayer = await this.playerRepository.getPlayerShipGrid(enemySocketId);
        const currPlayer = await this.playerRepository.getPlayerShipGrid(client.id);

        if (await this.gridService.checkWin(enemySocketId)) {
          client.broadcast.emit('check_win', { win: false, loss: true });
          client.emit('check_win', { win: true, loss: false });
        } else {
          client.broadcast.emit("update_grid", enemyPlayer);
          client.emit("update_grid", currPlayer);
        }
      }
  }

  async handleDisconnect(client: Socket) {
    await this.gridService.handleDisconnect(client.id);

    this.connections = this.connections.filter((conn) => conn !== client.id);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    if (this.connections.length < 2) {
      let player = await this.gridService.generatePlayerGrids(client.id);

      player = await this.gridService.addShips(player);

      this.connections.push(client.id);
      
      client.emit("update_grid", player);
    } else {
      client.broadcast.emit('check_win', { win: false, loss: false });
      client.emit('check_win', { win: false, loss: false });
    }
  }
}
