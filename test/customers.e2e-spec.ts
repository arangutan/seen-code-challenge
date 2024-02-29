import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomersModule } from 'src/customers/customers.module';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CustomersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/customers (GET)', () => {
    return request(app.getHttpServer()).get('/customers').expect(200);
  });

  it('/customers/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/customers/transactions')
      .expect(200);
  });

  it('/customers/transactions/{:id} (GET)', () => {
    return request(app.getHttpServer())
      .get('/customers/transactions/1')
      .expect(200);
  });

  it('/customers/related-transactions/{:id} (GET)', () => {
    return request(app.getHttpServer())
      .get('/customers/related-transactions/3')
      .expect(200);
  });
});
