import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface EncryptResponse {
  iv: string;
  encryptedData: string;
}

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
  private readonly iv = process.env.IV;

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.secretKey),
      Buffer.from(this.iv, 'hex'),
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${this.iv}:${encrypted.toString('hex')}`;
  }

  decrypt(hash: string): string {
    const theIv = hash?.split(':')?.[0];
    const theEncryptedData = hash?.split(':')?.[1];
    const iv = Buffer.from(theIv, 'hex');
    const encryptedText = Buffer.from(theEncryptedData, 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.secretKey),
      iv,
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}
