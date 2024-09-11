import mongoose from 'mongoose';
// MongoDB connection
// Main database connection
const MAIN_MONGO_URI = 'mongodb+srv://paliwalarpit93:ri4X1OcH1iGfWI5o@cluster0.yalb5cm.mongodb.net/library';
const mainConnection = mongoose.createConnection(MAIN_MONGO_URI);
// Transaction database connection
const TRANSACTION_MONGO_URI = 'mongodb+srv://paliwalarpit93:ri4X1OcH1iGfWI5o@cluster0.yalb5cm.mongodb.net/transactions';
const transactionConnection = mongoose.createConnection(TRANSACTION_MONGO_URI);
// Connect to both databases
Promise.all([mainConnection, transactionConnection])
    .then(() => console.log('Connected to both MongoDB databases'))
    .catch((err) => console.error('Error connecting to MongoDB databases:', err));
// Schemas
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});
const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
});
const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date },
    rentAmount: { type: Number },
});
// Models
const User = mainConnection.model('User', UserSchema);
const Book = mainConnection.model('Book', BookSchema);
const Transaction = transactionConnection.model('Transaction', TransactionSchema);
export { User, Book, Transaction };
