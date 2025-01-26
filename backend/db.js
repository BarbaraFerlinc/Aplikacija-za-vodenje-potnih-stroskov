const admin = require("firebase-admin");
const dotenv = require('dotenv');

dotenv.config();

const serviceAccount = JSON.parse(process.env.EXPRESS_APP_FIREBASE_KEY) || require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;