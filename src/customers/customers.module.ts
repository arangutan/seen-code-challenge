import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { HttpModule } from '@nestjs/axios';
import { CustomersService } from './customers.service';

@Module({
  imports: [HttpModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
