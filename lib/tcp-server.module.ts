import { DynamicModule, Logger, Module } from '@nestjs/common';

import { TCPServerOptions } from './tcp-server.types';
import { TCPServerService } from './tcp-server.service';
import { TCP_INSTANCE_TOKEN } from './tcp-server.constants';
import { createServer } from 'net';

export const tcpServer = (options?: TCPServerOptions) =>
  createServer().listen(
    options?.port || 3000,
    options?.host || '127.0.0.1',
    () => {
      Logger.log('Server started', 'TCPServerModule');
    },
  );

@Module({
  providers: [
    TCPServerService,
    {
      provide: TCP_INSTANCE_TOKEN,
      useFactory: () => tcpServer(),
    },
  ],
  exports: [TCPServerService],
})
export class TCPServerModule {
  static register(options: TCPServerOptions): DynamicModule {
    return {
      module: TCPServerModule,
      providers: [
        {
          provide: TCP_INSTANCE_TOKEN,
          useFactory: () => tcpServer(options),
        },
      ],
    };
  }
}
