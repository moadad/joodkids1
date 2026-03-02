# JoodKids — GitHub (تشغيل محلي)

## تشغيل محلي
```bash
cd apps/web
npm install
npm run dev
```

## دخول لوحة التحكم (مخفي)
- اضغط على اللوجو 5 مرات بسرعة (بدون أي إشعار)
- صفحة الدخول: `/control-login-9847`
- بعد الدخول: `/panel`

## متغيرات البيئة (مهم)
انسخ:
`apps/web/.env.local.example`
إلى:
`apps/web/.env.local`

ثم ضع بيانات Firebase (NEXT_PUBLIC_*) الخاصة بك.

### متغيرات السيرفر (Firebase Admin)
هذه مطلوبة فقط لحماية لوحة التحكم بالسيرفر (/panel):
- FIREBASE_ADMIN_PROJECT_ID
- FIREBASE_ADMIN_CLIENT_EMAIL
- FIREBASE_ADMIN_PRIVATE_KEY

> لا ترفع .env.local على GitHub.


## تفعيل صلاحية الأدمن (مرة واحدة)
1) فعّل Email/Password في Firebase Auth
2) أنشئ مستخدم الأدمن: `admin@erp.local`
3) حمّل ملف Service Account Key من Firebase وضعه داخل `tools/` باسم `serviceAccountKey.json`
4) نفّذ:
```bash
cd tools
npm init -y
npm i firebase-admin
node set-admin-claim.js
```
5) سجّل خروج/دخول للأدمن لتحديث التوكن.

## Firestore Rules
انسخ محتوى `firestore.rules` إلى Firebase Console -> Firestore -> Rules ثم Publish.
