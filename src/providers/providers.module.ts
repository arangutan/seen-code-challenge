import { Module } from '@nestjs/common';
import { HttpServiceRequest } from './http/http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [HttpServiceRequest],
  exports: [HttpServiceRequest],
})
export class ProvidersModule {}
