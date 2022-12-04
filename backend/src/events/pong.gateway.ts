import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// const games: Socket[] = [];

type Players = {
  [key: string]: { x: number; y: number };
};

const players: Players = {};

@WebSocketGateway({ cors: { origin: '*' } })
export class PongGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger: Logger = new Logger('Gateway Log');

  @SubscribeMessage('newPlayer')
  handleNewPlayer(
    @MessageBody() pos: { x: number; y: number },
    @ConnectedSocket() socket: Socket
  ): void {
    console.log(`new client: ${socket.id}`);
    players[socket.id] = pos;
    socket.emit('updatePlayers', players);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(
    @ConnectedSocket() socket: Socket
    // @MessageBody() pos: { x: number; y: number }
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete players[socket.id];
    console.log(`good-bey: ${socket.id}`);
    socket.emit('updatePlayers', players);
  }

  // @SubscribeMessage('events')
  // handleEvent(@MessageBody() message: string): void {
  //   this.server.emit('events', message);
  // }

  // @SubscribeMessage('events')
  // onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  //   const event = 'events';
  //   const response = [1, 2, 3];

  //   return from(response).pipe(map((data) => ({ event, data })));
  // }
}
