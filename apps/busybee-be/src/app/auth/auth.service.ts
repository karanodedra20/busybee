import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      let credential: admin.credential.Credential;

      // Try to load from environment variable first (for production/Render)
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
      } else {
        // Fall back to file import for local development
        try {
          const ServiceAccount = require('../../../firebase-service-account.json');
          credential = admin.credential.cert(ServiceAccount as admin.ServiceAccount);
        } catch {
          throw new Error(
            'Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT environment variable or add firebase-service-account.json file.'
          );
        }
      }

      admin.initializeApp({ credential });
    }
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException(`Invalid authentication token: ${error}`);
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      throw new UnauthorizedException(`User not found: ${error}`);
    }
  }
}
