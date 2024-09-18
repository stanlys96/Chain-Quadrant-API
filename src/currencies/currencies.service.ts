import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of } from 'rxjs';

@Injectable()
export class CurrenciesService {
  apiUrl = this.configService.get<string>('API_URL') + '/currencies';
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

  importCurrency(mintAddress: string) {
    const body = {
      mintAddress,
    };
    return this.httpService
      .post(`${this.apiUrl}/import`, body, { headers: this.headers })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return of(error?.response?.data ?? { message: 'error' });
        }),
      );
  }
}
