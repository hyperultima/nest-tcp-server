import { Inject, Injectable } from '@nestjs/common';
import { Server, Socket } from 'net';
import { Subject } from 'rxjs';
import { TCP_INSTANCE_TOKEN } from './tcp-server.constants';
import { Event, EventCommon, EventType } from './tcp-server.types';
import { ManageConnections } from './helper/manage-connections.helper';

@Injectable()
export class TCPServerService extends ManageConnections {
  /**
   * Write data to socket
   *
   * @param id socket identifier
   * @param data data to write
   *
   * @returns boolean | null
   */
  write(id: string, data: Uint8Array | string) {
    return this.getSocket(id)?.write(data);
  }

  /**
   * Socket events
   */
  onEvent: Subject<Event> = new Subject();

  /**
   * Listen to socket events
   *
   * @param socket TCP socket
   */
  private _listenToEvents(socket: Socket) {
    const that = this;

    // common data for event
    const common: EventCommon = {
      id: socket.id,
      get socket() {
        return that.getSocket(socket.id);
      },
    };

    // data event
    socket.on('data', (data) => {
      this.onEvent.next({
        ...common,
        type: EventType.DATA,
        data: data,
      });
    });

    // on close
    socket.on('close', (hadError) => {
      this.onEvent.next({
        ...common,
        type: EventType.CLOSE,
        hadError,
      });
    });

    // on end
    socket.on('end', () => {
      this.onEvent.next({
        ...common,
        type: EventType.END,
      });
    });

    // on timeout
    socket.on('timeout', () => {
      this.onEvent.next({
        ...common,
        type: EventType.TIMEOUT,
      });
    });
  }

  /**
   * New Connection callback
   */
  private _connection(socket: Socket) {
    const that = this;

    // add to active connections
    this.addSocket(socket);

    // listen to events
    this._listenToEvents(socket);

    // emit new connection
    this.onEvent.next({
      id: socket.id,
      type: EventType.CONNECTION,
      get socket() {
        return that.getSocket(socket.id);
      },
    });
  }

  /**
   * Initialize
   */
  private init() {
    this.server.on('connection', (socket) => this._connection(socket));
  }

  constructor(@Inject(TCP_INSTANCE_TOKEN) private server: Server) {
    super();
    this.init();
  }
}
