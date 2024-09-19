import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of } from 'rxjs';
import { Keypair } from '@solana/web3.js';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UsersService {
  apiUrl = this.configService.get<string>('API_URL') + '/users';
  apiKey = this.configService.get<string>('API_KEY');

  headers = {
    accept: 'application/json',
    'x-api-key': this.apiKey,
    'content-type': 'application/json',
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {}

  getAllUsers() {
    return this.httpService.get(this.apiUrl, { headers: this.headers }).pipe(
      map((response) => response.data),
      catchError((error) => {
        return of(error?.response?.data ?? { message: 'error' });
      }),
    );
  }

  registerUser(referenceId: string, email: string) {
    const body = {
      referenceId,
      email,
    };
    try {
      return this.httpService
        .post(this.apiUrl, body, { headers: this.headers })
        .pipe(
          map((response) => response.data),
          catchError((error) => {
            return of(error?.response?.data ?? { message: 'error' });
          }),
        );
    } catch (error) {
      console.log(error);
      return {
        message: 'error',
      };
    }
  }

  getUserWalletAddress(referenceId: string) {
    return this.httpService
      .get(`${this.apiUrl}/${referenceId}/wallet-address`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return of(error?.response?.data ?? { message: 'error' });
        }),
      );
  }

  getUserItemDetails(referenceId: string, itemId: string) {
    return this.httpService
      .get(`${this.apiUrl}/${referenceId}/items/${itemId}`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return of(error?.response?.data ?? { message: 'error' });
        }),
      );
  }

  transferItem(
    referenceId: string,
    itemId: string,
    destinationUserReferenceId: string,
    quantity: string,
  ) {
    const body = {
      destinationUserReferenceId,
      quantity,
    };
    return this.httpService
      .post(`${this.apiUrl}/${referenceId}/items/${itemId}/transfer`, body, {
        headers: this.headers,
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          return of(error?.response?.data ?? { message: 'error' });
        }),
      );
  }

  createSolanaAddress() {
    const keypair = Keypair.generate();
    // const theRealPrivateKey = Keypair.fromSecretKey(keypair.secretKey);
    const encryptedPrivateKey = this.cryptoService.encrypt(
      keypair.secretKey.toString(),
    );
    // const decryptedPrivateKey = this.cryptoService.decrypt(encryptedPrivateKey);
    const walletDetails = {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: encryptedPrivateKey,
    };

    return {
      ...walletDetails,
    };
  }
}
