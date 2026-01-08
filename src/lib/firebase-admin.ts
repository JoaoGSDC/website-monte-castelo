import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
  auth_uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
  token_uri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CERT_URL,
};

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount as any) }) : getApps()[0];

const adminDb = getFirestore(app);

export { adminDb };
