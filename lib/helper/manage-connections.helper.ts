import { ActiveSockets } from '../../lib/tcp-server.types';
import { Socket } from 'net';
import { nanoid } from 'nanoid';

export class ManageConnections {
  /**
   * Get socket instance
   *
   * @param id - socket identifier
   * @returns socker | null if doesn't exists
   */
  getSocket(id: string) {
    const socket = this._activeSockets[id];
    if (socket) return socket;
    return null;
  }

  /**
   * Append additional data to socket instance
   *
   * @param id - socket identifier
   * @param data - object to be appended
   * @returns boolean
   */
  appendDataToSocket(id: string, data: object) {
    const socket = this.getSocket(id);
    if (socket) {
      for (let key in data) socket[key] = data[key];
      return true;
    }
    return false;
  }

  /**
   * Remove socket connection
   *
   * @param id - socket identifier
   * @returns true if delete successful else false
   */
  protected removeSocket(id: string) {
    const socket = this._activeSockets[id];
    if (socket) {
      delete this._activeSockets[id];
      return true;
    }
    return false;
  }

  /**
   * Add a new connection to object
   *
   * @param socket - socket connection
   */
  protected addSocket(socket: Socket) {
    // add unique identifier to socket
    socket.id = nanoid();

    this._activeSockets[socket.id] = socket;
  }

  /**
   * Active socket connections
   */
  private _activeSockets: ActiveSockets = {};
}
