import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [HttpModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
