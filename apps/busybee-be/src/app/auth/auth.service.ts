import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      let credential: admin.credential.Credential;

      // Try to load from environment variable first (for production/Render)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        // Decode base64 encoded service account (recommended for Render)
        try {
          const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
          const serviceAccount = JSON.parse(decoded);
          credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
        } catch (error) {
          console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64');
          throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is invalid.');
        }
      } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Fallback to direct JSON (less reliable on some platforms)
        try {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
        } catch (parseError) {
          console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable');
          console.error('First 100 characters:', process.env.FIREBASE_SERVICE_ACCOUNT.substring(0, 100));
          console.error('Parse error:', parseError);
          throw new Error(
            'FIREBASE_SERVICE_ACCOUNT environment variable contains invalid JSON. ' +
            'Use FIREBASE_SERVICE_ACCOUNT_BASE64 instead for better reliability.'
          );
        }
      } else {
        // Fall back to file import for local development or Render secret files
        try {
          // Try Render secret file path first
          let ServiceAccount;
          try {
            ServiceAccount = require('/etc/secrets/firebase-service-account.json');
          } catch {
            // Fall back to local development path
            ServiceAccount = require('../../../firebase-service-account.json');
          }
          credential = admin.credential.cert(ServiceAccount as admin.ServiceAccount);
        } catch {
          throw new Error(
            'Firebase credentials not found. Options:\n' +
            '1. Set FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable (recommended for Render)\n' +
            '2. Set FIREBASE_SERVICE_ACCOUNT environment variable\n' +
            '3. Add firebase-service-account.json file (local dev)\n' +
            '4. Use Render Secret Files at /etc/secrets/firebase-service-account.json'
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
