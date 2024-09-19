import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of } from 'rxjs';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { encode, decode } from 'base-58';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const decryptedPrivateKey = this.cryptoService.decrypt(encryptedPrivateKey);
    const walletDetails = {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: encryptedPrivateKey,
    };
    // Convert the decimal array to a Uint8Array
    const privateKeyBytes = Uint8Array.from(keypair.secretKey);

    // Encode the byte array into Base58
    const base58PrivateKey = encode(privateKeyBytes);
    const newUser = new User();
    newUser.email = '';
    newUser.reference_id = '';
    newUser.public_key = keypair.publicKey.toBase58();
    newUser.private_key = encryptedPrivateKey;
    this.userRepository.save(newUser);
    return {
      ...walletDetails,
      privateKey: keypair.secretKey.toString(),
      base58PrivateKey,
      decryptedPrivateKey,
    };
  }

  async airdropSOL() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const airdropSignature = await connection.requestAirdrop(
      new PublicKey('4uwct427oD3RVLKAq4Rh3bBnbt78EH2r6XDBV95kSmzB'),
      1e9, // 1 SOL (1e9 lamports = 1 SOL)
    );
    await connection.confirmTransaction(airdropSignature);
    console.log(`Airdropped 1 SOL to the sender's wallet`);
    return airdropSignature;
  }

  async sendToAnotherUser(amount: number) {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const publicKey = new PublicKey(
      '4uwct427oD3RVLKAq4Rh3bBnbt78EH2r6XDBV95kSmzB',
    );
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('DWdSJiiokFcmNTNEwrgwVhUjaScsKxkpCeUk8Nm4obAr'),
        lamports: amount * 1e9,
      }),
    );
    const privateKey = decode(
      '3S7TBvHXFioNdmu9E1Z185is26hKy2G4vS3YRuxo8TrHUnxoMeBoimeqSC59V53Gkiadipx6izEw5MYWK1SupuCw',
    );
    const sender = {
      publicKey: publicKey,
      secretKey: privateKey,
    };
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);
    console.log(`Transaction confirmed with signature: ${signature}`);
    return {
      transactionId: signature,
    };
  }
}
