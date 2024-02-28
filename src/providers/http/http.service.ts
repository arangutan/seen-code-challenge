import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Transaction } from './dto';

const API_URL = 'https://cdn.seen.com/challenge/transactions-v2.json';

@Injectable()
export class HttpServiceRequest {
  constructor(private readonly httpService: HttpService) {}

  async getAllTransactions(): Promise<Transaction[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(API_URL).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
