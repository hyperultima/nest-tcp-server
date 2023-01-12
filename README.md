# Nest TCP Server

A simple TCP server for NestJS

## Installation

```bash
$ npm i --save @hyperultima/nest-tcp-server
```

## Usage

```
import { Module } from '@nestjs/common';
import { TCPServerModule } from 'lib';

@Module({
  imports: [
    TCPServerModule.register({
      host: '127.0.0.1',
      port: 300,
    }),
  ],
})
export class AppModule {}

```
