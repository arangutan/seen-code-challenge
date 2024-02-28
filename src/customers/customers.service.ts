import { Injectable } from '@nestjs/common';
import { HttpServiceRequest } from 'src/providers/http/http.service';
import { consolidatedTrx } from 'src/utils/getCustomerTrx';

@Injectable()
export class CustomersService {
  constructor(private readonly httpServiceRequest: HttpServiceRequest) {}

  getAllTransactions() {
    return this.httpServiceRequest.getAllTransactions();
  }

  async getAllTransactionsByUser(id: string) {
    const transaccions = await this.httpServiceRequest.getAllTransactions();

    return consolidatedTrx(transaccions, parseInt(id));
  }
}
