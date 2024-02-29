import { Controller, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get(['', 'transactions'])
  getTransactions() {
    return this.customerService.getAllTransactions();
  }

  @Get('transactions/:id')
  getTransactionsByCustomer(@Param('id') id: string) {
    return this.customerService.getAllTransactionsByCustomer(id);
  }

  @Get('related-transactions/:id')
  getRelatedCustomersByTrxType(@Param('id') id: string) {
    return this.customerService.getRelatedByCustomerByTrxType(id);
  }
}
