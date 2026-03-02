import * as admin from "firebase-admin";

function privateKey() {
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  return key ? key.replace(/\\n/g, "\n") : undefined;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey(),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();