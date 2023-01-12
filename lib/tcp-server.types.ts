import { Socket } from 'net';

export interface KeepAlive {
  /**
   * Enable keep alive
   */
  enable?: boolean;

  /**
   * Initial delay (in milliseconds)
   */
  initialDelay?: number;
}

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

  /**
   * keep-alive functionality
   */
  keepAlive?: KeepAlive;

  /**
   * Set timeout (in milliseconds)
   */
  timeout?: number;
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

  /**
   * Socket instance
   */
  socket: Socket;
}

export enum EventType {
  DATA = 'DATA',
  CLOSE = 'CLOSE',
  END = 'END',
  CONNECTION = 'CONNECTION',
  TIMEOUT = 'TIMEOUT',
}

export interface OnConnection {
  /**
   * Socket end
   */
  type: EventType.CONNECTION;
}

export interface OnTimeout {
  /**
   * Socket end
   */
  type: EventType.TIMEOUT;
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
export type Event = (OnData | OnClose | OnEnd | OnConnection | OnTimeout) &
  EventCommon;
