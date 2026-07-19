const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let db;
const useMock = process.env.USE_FIREBASE_MOCK === 'true';
const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

// Helper class to enable chainable Firestore queries in Mock Mode
class MockQuery {
  constructor(docs) {
    this.docs = docs;
  }

  where(field, operator, value) {
    let filteredDocs = [...this.docs];
    if (operator === '==') {
      filteredDocs = filteredDocs.filter(doc => doc[field] === value);
    } else if (operator === 'in' && Array.isArray(value)) {
      filteredDocs = filteredDocs.filter(doc => value.includes(doc[field]));
    }
    return new MockQuery(filteredDocs);
  }

  async get() {
    return {
      empty: this.docs.length === 0,
      docs: this.docs.map(doc => ({
        id: doc.id || 'mock-id',
        data: () => JSON.parse(JSON.stringify(doc))
      }))
    };
  }
}

// Simple Mock Firestore for local testing without Firebase credentials
class MockFirestore {
  constructor() {
    this.store = {
      restaurants: {
        xyner: {
          name: "XYNER",
          total_capacity_seats: 50,
          operating_hours: { open: "12:00", close: "23:59" }
        }
      },
      reservations: {},
      sessions: {},
      orders: {}
    };
  }

  collection(collectionName) {
    if (!this.store[collectionName]) {
      this.store[collectionName] = {};
    }

    return {
      doc: (docId) => {
        return {
          get: async () => {
            const data = this.store[collectionName][docId];
            return {
              exists: !!data,
              data: () => data ? JSON.parse(JSON.stringify(data)) : null
            };
          },
          set: async (data, options) => {
            if (options && options.merge && this.store[collectionName][docId]) {
              this.store[collectionName][docId] = {
                ...this.store[collectionName][docId],
                ...data
              };
            } else {
              this.store[collectionName][docId] = data;
            }
            return { id: docId };
          },
          update: async (data) => {
            if (!this.store[collectionName][docId]) {
              throw new Error(`Document ${docId} does not exist in collection ${collectionName}`);
            }
            this.store[collectionName][docId] = {
              ...this.store[collectionName][docId],
              ...data
            };
            return { id: docId };
          }
        };
      },
      add: async (data) => {
        const docId = Math.random().toString(36).substring(2, 15);
        this.store[collectionName][docId] = { ...data, id: docId };
        return { id: docId, get: async () => ({ data: () => this.store[collectionName][docId] }) };
      },
      where: (field, operator, value) => {
        const query = new MockQuery(Object.values(this.store[collectionName]));
        return query.where(field, operator, value);
      }
    };
  }
}

if (useMock || !fs.existsSync(serviceAccountPath)) {
  console.log("⚠️  Running in Firebase Mock Mode. No real Firestore connections will be made.");
  db = new MockFirestore();
} else {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("✅ Successfully initialized Firebase Admin Firestore.");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin with service account key. Falling back to Mock Mode.", error);
    db = new MockFirestore();
  }
}

module.exports = { db };
