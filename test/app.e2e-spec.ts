import { EventType, OnData, OnTimeout } from '../lib/tcp-server.types';
import { Test, TestingModule } from '@nestjs/testing';
import { filter, map, take } from 'rxjs';

import { INestApplication } from '@nestjs/common';
import { TCPServerModule } from '../lib/tcp-server.module';
import { TCPServerService } from '../lib/tcp-server.service';
import { exec } from 'child_process';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let service: TCPServerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<TCPServerService>(TCPServerService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should receive emitted data', (done) => {
    service.onEvent
      .pipe(
        filter((data) => data.type === EventType.DATA),
        map((data) => data as OnData),
        take(1),
      )
      .subscribe((event) => {
        try {
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('data');
          expect(event).toHaveProperty('type');
          expect(event.data).toBeInstanceOf(Buffer);
          expect(event.data.toString()).toEqual('mydata\r\n');
          done();
        } catch (err) {
          done(err);
        }
      });
    exec('{ echo "mydata"; sleep 1; } | telnet 127.0.0.1 3001');
  });

  it('Should receive timeout event', (done) => {
    service.onEvent
      .pipe(
        filter((data) => data.type === EventType.TIMEOUT),
        map((data) => data as OnTimeout),
        take(1),
      )
      .subscribe((event) => {
        try {
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('type');
          expect(event.type).toEqual(EventType.TIMEOUT);
          done();
        } catch (err) {
          done(err);
        }
      });
    exec('telnet 127.0.0.1 3001');
  });

  it('Should receive timeout event', (done) => {
    service.onEvent
      .pipe(
        filter((data) => data.type === EventType.TIMEOUT),
        map((data) => data as OnTimeout),
        take(1),
      )
      .subscribe((event) => {
        try {
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('type');
          expect(event.type).toEqual(EventType.TIMEOUT);
          done();
        } catch (err) {
          done(err);
        }
      });
    exec('telnet 127.0.0.1 3001');
  });
});
