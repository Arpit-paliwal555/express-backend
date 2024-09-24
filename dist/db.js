"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Book = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// MongoDB connection
// Main database connection
const MAIN_MONGO_URI = process.env.MAIN_MONGO_URI || '';
const mainConnection = mongoose_1.default.createConnection(MAIN_MONGO_URI);
// Transaction database connection
const TRANSACTION_MONGO_URI = process.env.TRANSACTION_MONGO_URI || '';
const transactionConnection = mongoose_1.default.createConnection(TRANSACTION_MONGO_URI);
// Connect to both databases
Promise.all([mainConnection, transactionConnection])
    .then(() => console.log('Connected to both MongoDB databases'))
    .catch((err) => console.error('Error connecting to MongoDB databases:', err));
// Schemas
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});
const BookSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
});
const TransactionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    bookName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date },
    rentAmount: { type: Number },
});
// Models
const User = mainConnection.model('User', UserSchema);
exports.User = User;
const Book = mainConnection.model('Book', BookSchema);
exports.Book = Book;
const Transaction = transactionConnection.model('Transaction', TransactionSchema);
exports.Transaction = Transaction;
