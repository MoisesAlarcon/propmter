import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URL;

async function removeIndexes() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Eliminar el índice único del campo imageUrl
    await collection.dropIndex('imageUrl_1');
    console.log('Index imageUrl_1 removed');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error removing indexes:', error);
  }
}

removeIndexes();