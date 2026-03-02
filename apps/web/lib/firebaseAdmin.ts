import admin from "firebase-admin";

function privateKey() {
  const k = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  return k ? k.replace(/\n/g, "
") : undefined;
}

export const adminApp =
  admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey(),
        } as any),
      });

export const adminAuth = adminApp.auth();
