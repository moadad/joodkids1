const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const ADMIN_EMAIL = "admin@erp.local";

async function main() {
  const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log("✅ admin claim set for:", user.uid);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
