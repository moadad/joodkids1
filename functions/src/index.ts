/**
 * Optional (Production upgrade):
 * - Signed Cloudinary uploads (admin only)
 * - Delete-all products (admin only) server-side
 * - Set custom claims admin
 *
 * This scaffold is intentionally minimal; enable as needed.
 */

import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

export const ping = functions.https.onRequest((_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// TODO: implement setAdminClaim, signedUploadSignature, deleteAllProducts securely.
