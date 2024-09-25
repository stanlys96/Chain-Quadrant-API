import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of } from 'rxjs';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction as TransactionSolana,
} from '@solana/web3.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { encode, decode } from 'base-58';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Airdrop } from './entities/airdrop.entity';

function stringToArrayOfNumbers(input: string): number[] {
  return input.split(',').map(Number);
}

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
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Transaction)
    private readonly airdropRepository: Repository<Airdrop>,
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
    console.log(keypair);
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
      publicKey: keypair.publicKey.toBase58(),
      // privateKey: keypair.secretKey.toString(),
      base58PrivateKey,
      // decryptedPrivateKey,
      // encryptedPrivateKey,
    };
  }

  async airdropSOL(walletAddress: string) {
    try {
      const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
      const airdropSignature = await connection.requestAirdrop(
        new PublicKey(walletAddress),
        1e9, // 1 SOL (1e9 lamports = 1 SOL)
      );
      const airdrop = new Airdrop();

      await connection.confirmTransaction(airdropSignature);
      // console.log(`Airdropped 1 SOL to ${walletAddress}`);
      airdrop.address = walletAddress;
      airdrop.amount = 1;
      airdrop.signature = airdropSignature;
      this.airdropRepository.save(airdrop);
      return {
        status: 200,
        signature: airdropSignature,
        walletAddress: walletAddress,
      };
    } catch (e) {
      return { status: 404, message: e?.toString()?.replace('Error ', '') };
    }
  }

  async sendToAnotherUser(
    amount: number,
    fromPublic: string,
    fromPrivate: string,
    toPublic: string,
  ) {
    try {
      const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
      const publicKey = new PublicKey(fromPublic);
      const transaction = new TransactionSolana().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toPublic),
          lamports: amount * 1e9,
        }),
      );
      // const decryptedPrivateKey = Uint8Array.from(
      //   stringToArrayOfNumbers(this.cryptoService.decrypt(fromPrivate)),
      // );
      // console.log(decryptedPrivateKey, '<<< PRIVATE KEY');
      // console.log(decryptedPrivateKey);
      // const privateKeyBytes = Uint8Array.from(keypair.secretKey);
      const privateKey = decode(fromPrivate);
      const sender = {
        publicKey: publicKey,
        secretKey: privateKey,
      };
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender],
      );
      const newTransaction = new Transaction();
      newTransaction.from_address = fromPublic;
      newTransaction.to_address = toPublic;
      newTransaction.transaction_id = signature;
      newTransaction.amount = amount;
      this.transactionRepository.save(newTransaction);
      return {
        status: 200,
        transactionId: signature,
      };
    } catch (e) {
      console.log(e, '<<< E');
      return { status: 404, message: e?.toString()?.replace('Error ', '') };
    }
  }

  async getWalletBalance(walletAddress: string) {
    try {
      // Create a connection to the Solana cluster (mainnet, testnet, or devnet)
      const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

      // Create a PublicKey object from the wallet address string
      const publicKey = new PublicKey(walletAddress);

      // Get the balance (in lamports)
      const balance = await connection.getBalance(publicKey);

      // Convert balance from lamports to SOL
      const balanceInSOL = balance / 1e9; // 1 SOL = 1 billion lamports

      return { status: 200, balance: balanceInSOL, walletAddress };
    } catch (e) {
      return { status: 404, message: e?.toString()?.replace('Error ', '') };
    }
  }

  // async decoding(publicKey: string, privateKey: string) {
  //   console.log(publicKey);
  //   console.log(privateKey);
  //   const decryptedPrivateKey = Uint8Array.from(
  //     stringToArrayOfNumbers(this.cryptoService.decrypt(privateKey)),
  //   );
  //   const privateKeyBytes = Uint8Array.from(decryptedPrivateKey);

  //   // Encode the byte array into Base58
  //   const base58PrivateKey = encode(privateKeyBytes);
  //   // const thePublic = decode(publicKey);
  //   // console.log(thePublic);
  //   console.log(base58PrivateKey);
  //   return {
  //     base58PrivateKey,
  //     // thePublic,
  //   };
  // }
}
