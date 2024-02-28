import { Controller, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get('')
  @Get('transactions')
  getTransactions() {
    return this.customerService.getAllTransactions();
  }

  @Get('transactions/:id')
  getTransactionsByCustomer(@Param('id') id: string) {
    console.log(id);
    return this.customerService.getAllTransactions();
  }
}
