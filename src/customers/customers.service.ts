import { Injectable } from '@nestjs/common';
import { HttpServiceRequest } from 'src/providers/http/http.service';
import { findConsolidatedTrx, findRelatedCustomers } from 'src/utils';

@Injectable()
export class CustomersService {
  constructor(private readonly httpServiceRequest: HttpServiceRequest) {}

  getAllTransactions() {
    return this.httpServiceRequest.getAllTransactions();
  }

  async getAllTransactionsByCustomer(id: string) {
    const transaccions = await this.httpServiceRequest.getAllTransactions();

    return findConsolidatedTrx(transaccions, parseInt(id));
  }

  async getRelatedByCustomerByTrxType(id: string) {
    const transaccions = await this.httpServiceRequest.getAllTransactions();

    return findRelatedCustomers(transaccions, parseInt(id));
  }
}
