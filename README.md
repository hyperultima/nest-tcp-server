# Nest TCP Server

A simple TCP server for NestJS. This package is a wrapper around [NodeJS net module](https://nodejs.org/api/net.html).

## Installation

```bash
$ npm i --save @hyperultima/nest-tcp-server
```

## Usage

```JS
/*
 * AppModule
 */
import { Module } from '@nestjs/common';
import { TCPServerModule } from 'lib';

@Module({
  imports: [
    TCPServerModule.register({
      port: 3001,
      host: "127.0.0.1",
      timeout: 1000,
      keepAlive: {
        enable: true,
        initialDelay: 2000
      },
    }),
  ],
})
export class AppModule {}

/*
 * Service
 */
import { Injectable } from '@nestjs/common';
import { TCPServerService } from '@hyperultima/nest-tcp-server';

@Injectable()
export class AppService {
  constructor(private tcp: TCPServerService) {}
}
```

## Configuration

```JS
{
  port: 3001,               // server port
  host: "127.0.0.1",        // server host
  timeout: 1000,            // socket timeout (in ms)
  keepAlive: {
    enable: true,           // enable keep-alive
    initialDelay: 2000      // keep-alive initial delay (in ms)
  },
}
```