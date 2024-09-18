import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of } from 'rxjs';

@Injectable()
export class TransactionsService {
  apiUrl = this.configService.get<string>('API_URL') + '/transactions';
  apiKey = this.configService.get<string>('API_KEY');

  headers = {
    accept: 'application/json',
    'x-api-key': this.apiKey,
    'content-type': 'application/json',
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getTransactionDetails(transactionId: string) {
    return this.httpService
      .get(`${this.apiUrl}/${transactionId}`, { headers: this.headers })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return of(error?.response?.data ?? { message: 'error' });
        }),
      );
  }
}
