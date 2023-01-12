import { EventCommon, EventType, OnClose, OnData } from './tcp-server.types';
import { TCPServerModule, tcpServer } from './tcp-server.module';
import { Test, TestingModule } from '@nestjs/testing';
import { filter, map, pipe, take } from 'rxjs';

import { Server } from 'net';
import { TCPServerService } from './tcp-server.service';
import { TCP_INSTANCE_TOKEN } from './tcp-server.constants';
import { exec } from 'child_process';

describe('TCPServerService', () => {
  let service: TCPServerService;
  let server = tcpServer();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TCPServerService,
        {
          provide: TCP_INSTANCE_TOKEN,
          useValue: server,
        },
      ],
    }).compile();
    service = module.get<TCPServerService>(TCPServerService);
  });

  it('Should emit provided data in "Data" event', (done) => {
    service.onEvent
      .pipe(
        filter((data) => data.type === EventType.DATA),
        map((data) => data as OnData),
        take(1),
      )
      .subscribe((event) => {
        try {
          expect(event.type).toEqual(EventType.DATA);
          expect(event.data).toBeInstanceOf(Buffer);
          expect(event.data.toString()).toEqual('testcommand\r\n');
          done();
        } catch (err) {
          done(err);
        }
      });
    exec('{ echo "testcommand"; sleep 1; } | telnet 127.0.0.1 3000');
  });

  it('Should emit custom data appended to socket instance', (done) => {
    service.onEvent
      .pipe(
        filter((event) => event.type === EventType.CONNECTION),
        map((data) => data as EventCommon),
        take(1),
      )
      .subscribe((event) => {
        service.appendDataToSocket(event.id, {
          hello: 'world',
        });
        try {
          expect(service.getSocket(event.id)).toHaveProperty('hello');
          expect(service.getSocket(event.id)!['hello']).toBe('world');
          done();
        } catch (err) {
          done(err);
        }
      });
    exec('{ sleep 100; } | telnet 127.0.0.1 3000');
  });

  describe('Socket identifier', () => {
    it('Should have socket identifer (id) in case of "Connection" event', (done) => {
      service.onEvent
        .pipe(
          filter((event) => event.type === EventType.CONNECTION),
          map((data) => data as EventCommon),
          take(1),
        )
        .subscribe((event) => {
          try {
            expect(event).toHaveProperty('id');
            done();
          } catch (err) {
            done(err);
          }
        });
      exec('{ sleep 1; } | telnet 127.0.0.1 3000');
    });

    it('Should have socket identifer (id) in case of "Data" event', (done) => {
      service.onEvent
        .pipe(
          filter((event) => event.type === EventType.DATA),
          map((data) => data as EventCommon),
          take(1),
        )
        .subscribe((event) => {
          try {
            expect(event).toHaveProperty('id');
            done();
          } catch (err) {
            done(err);
          }
        });
      exec('{ echo "testcommand"; sleep 1; } | telnet 127.0.0.1 3000');
    });

    it('Should have socket identifer (id) in case of "Close" event', (done) => {
      service.onEvent
        .pipe(
          filter((event) => event.type === EventType.CLOSE),
          map((data) => data as EventCommon),
          take(1),
        )
        .subscribe((event) => {
          try {
            expect(event).toHaveProperty('id');
            done();
          } catch (err) {
            done(err);
          }
        });
      exec('{ echo "testcommand"; sleep 1; } | telnet 127.0.0.1 3000');
    });

    it('Should have socket identifer (id) in case of "End" event', (done) => {
      service.onEvent
        .pipe(
          filter((event) => event.type === EventType.END),
          map((data) => data as EventCommon),
          take(1),
        )
        .subscribe((event) => {
          try {
            expect(event).toHaveProperty('id');
            done();
          } catch (err) {
            done(err);
          }
        });
      exec('{ echo "testcommand"; sleep 1; } | telnet 127.0.0.1 3000');
    });
  });
});
