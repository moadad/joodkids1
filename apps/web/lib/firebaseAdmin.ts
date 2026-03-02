import * as admin from "firebase-admin";

function getPrivateKey() {
  const k = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!k) return undefined;

  // لو مخزن في Vercel كـ \n نحولها لـ newline حقيقي
  return k.replace(/\\n/g, "\n");
}

function getProjectId() {
  return process.env.FIREBASE_ADMIN_PROJECT_ID;
}

function getClientEmail() {
  return process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
}

export const adminApp =
  admin.apps.length > 0
    ? admin.apps[0]
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: getProjectId(),
          clientEmail: getClientEmail(),
          privateKey: getPrivateKey(),
        }),
      });

export const adminDb = admin.firestore();