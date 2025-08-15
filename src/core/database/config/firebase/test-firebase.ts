// // src/core/database/config/firebase/test-firebase.ts
// import { join } from 'path';
// import * as fs from 'fs';
// import * as admin from 'firebase-admin';
// import { config } from 'dotenv';

// config(); // Load .env variables

// async function testFirebase() {
//   try {
//     const serviceAccountPath = join(process.cwd(), process.env.FIREBASE_CREDENTIALS_PATH || '');

//     if (!fs.existsSync(serviceAccountPath)) {
//       throw new Error(` Firebase credentials not found at: ${serviceAccountPath}`);
//     }

//     const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });

//     const db = admin.firestore();

//     const snapshot = await db.collection('therapists').limit(1).get();

//     if (snapshot.empty) {
//       console.log(' Firebase connected, but therapists collection is empty.');
//     } else {
//       console.log(' Firebase connected successfully. Sample data:');
//       console.log(snapshot.docs.map(doc => doc.data()));
//     }
//   } catch (error) {
//     console.error(' Firebase connection test failed:', error.message);
//   }
// }

// testFirebase();
