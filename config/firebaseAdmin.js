import admin from "firebase-admin"
import { firebaseServiceAccount } from "../serviceAccountFirebase.js";

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: "https://todo-auth-d8fb0.firebaseio.com"
});

const db = admin.firestore();

export default db;