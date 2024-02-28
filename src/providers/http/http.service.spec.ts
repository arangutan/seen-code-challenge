import { Test, TestingModule } from '@nestjs/testing';
import { HttpServiceRequest } from './http.service';

describe('HttpService', () => {
  let service: HttpServiceRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpServiceRequest],
    }).compile();

    service = module.get<HttpServiceRequest>(HttpServiceRequest);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
