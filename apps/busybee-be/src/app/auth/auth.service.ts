import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      let credential: admin.credential.Credential;

      // Try to load from environment variable first (for Fly.io production)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        try {
          const decoded = Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
            'base64'
          ).toString('utf-8');
          const serviceAccount = JSON.parse(decoded);
          credential = admin.credential.cert(
            serviceAccount as admin.ServiceAccount
          );
        } catch {
          throw new Error(
            'Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64. Ensure it is a valid base64-encoded JSON.'
          );
        }
      } else {
        // Fall back to local file for development
        try {
          const ServiceAccount = require('../../../firebase-service-account.json');
          credential = admin.credential.cert(
            ServiceAccount as admin.ServiceAccount
          );
        } catch {
          throw new Error(
            'Firebase credentials not found. Either:\n' +
              '1. Set FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable (production)\n' +
              '2. Add firebase-service-account.json file (local development)'
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
