import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// MongoDB connection
// Main database connection
const MAIN_MONGO_URI = process.env.MAIN_MONGO_URI || '';
const mainConnection = mongoose.createConnection(MAIN_MONGO_URI);

// Transaction database connection
const TRANSACTION_MONGO_URI = process.env.TRANSACTION_MONGO_URI || '';
const transactionConnection = mongoose.createConnection(TRANSACTION_MONGO_URI);

// Connect to both databases
Promise.all([mainConnection, transactionConnection])
  .then(() => console.log('Connected to both MongoDB databases'))
  .catch((err) => console.error('Error connecting to MongoDB databases:', err));

// Interfaces
interface IUser {
  name: string;
  email: string;
}

interface IBook {
  name: string;
  category: string;
  rentPerDay: number;
}

interface ITransaction {
  bookName: string;
  userId: mongoose.Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  rentAmount?: number;
}

// Schemas
const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const BookSchema = new mongoose.Schema<IBook>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  rentPerDay: { type: Number, required: true },
});

const TransactionSchema = new mongoose.Schema<ITransaction>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookName: { type: String, required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date },
  rentAmount: { type: Number },
});

// Models
const User = mainConnection.model<IUser>('User', UserSchema);
const Book = mainConnection.model<IBook>('Book', BookSchema);
const Transaction = transactionConnection.model<ITransaction>('Transaction', TransactionSchema);

export { User, Book, Transaction, ITransaction, IUser };