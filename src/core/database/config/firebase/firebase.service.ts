import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';
import { config } from 'dotenv';
import * as fs from 'fs';

config(); // Load .env file

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccountPath = join(process.cwd(), process.env.FIREBASE_CREDENTIALS_PATH || '');

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Firebase credentials file not found at path: ${serviceAccountPath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  getFirestore = () => admin.firestore();
}
