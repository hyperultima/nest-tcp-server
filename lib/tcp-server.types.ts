import { Socket } from 'net';

export interface TCPServerOptions {
  /**
   * Host
   *
   * default: 127.0.0.1
   */
  host?: string;

  /**
   * Post
   *
   * default: 3000
   */
  port?: number;
}

/**
 * Active connection interface
 */
export interface ActiveSockets {
  [id: string]: Socket;
}

/**
 * Event common properties
 */
export interface EventCommon {
  /**
   * Socket identifier
   */
  id: string;
}

export enum EventType {
  DATA = 'DATA',
  CLOSE = 'CLOSE',
  END = 'END',
  CONNECTION = 'CONNECTION',
}

export interface OnConnection {
  /**
   * Socket end
   */
  type: EventType.CONNECTION;
}

export interface OnData {
  /**
   * Socket data
   */
  type: EventType.DATA;

  /**
   * Data received from socket
   */
  data: Buffer;
}

export interface OnClose {
  /**
   * Socket close
   */
  type: EventType.CLOSE;

  /**
   * Socket had error when closed
   */
  hadError: boolean;
}

export interface OnEnd {
  /**
   * Socket end
   */
  type: EventType.END;
}

/**
 * Socket events
 */
export type Event = (OnData | OnClose | OnEnd | OnConnection) & EventCommon;
