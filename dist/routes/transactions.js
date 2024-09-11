"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const db_2 = require("../db");
exports.transactionsRouter = (0, express_1.Router)();
// Get all transactions for the book
exports.transactionsRouter.get("/book/:bookName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookName = req.params.bookName;
        // Get all transactions for the book
        const transactions = yield db_2.Transaction.find({ bookName });
        // Calculate total count of people who issued the book
        const totalIssuers = new Set(transactions.map(t => t.userId.toString())).size;
        // Find the current issuer (if any)
        const currentIssue = transactions.find(t => !t.returnDate);
        let currentIssuer = null;
        let status = "Not issued at the moment";
        if (currentIssue) {
            // Ensure userId is valid
            if (currentIssue.userId) {
                currentIssuer = yield db_1.User.findById(currentIssue.userId);
                if (currentIssuer) {
                    status = "Currently issued";
                }
                else {
                    // Handle case where user is not found
                    status = "Current issuer not found";
                }
            }
        }
        else {
            console.log("current issue is null");
        }
        res.json({
            bookName,
            totalIssuers,
            currentIssuer: currentIssuer ? {
                id: currentIssuer._id,
                name: currentIssuer.name
            } : null,
            status
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching book transactions" });
    }
}));
// Get total rent for the book
exports.transactionsRouter.get("/rent/:bookName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookName = req.params.bookName;
        // Get all transactions for the book
        const transactions = yield db_2.Transaction.find({ bookName });
        // Calculate total rent generated
        const totalRent = transactions.reduce((sum, transaction) => {
            return sum + (transaction.rentAmount || 0);
        }, 0);
        res.json({
            bookName,
            totalRent
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while calculating total rent for the book" });
    }
}));
// Get all books issued by the user
exports.transactionsRouter.get("/user-books/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Find the user
        const user = yield db_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Get all transactions for the user where the book is currently issued
        const transactions = yield db_2.Transaction.find({
            userId: userId,
            returnDate: null // Assuming null returnDate means the book is still issued
        }).populate('bookName'); // Populate the book details
        // Extract book information from transactions
        const issuedBooks = transactions.map(transaction => ({
            bookName: transaction.bookName,
            issueDate: transaction.issueDate
        }));
        res.json({
            userId: user._id,
            userName: user.name,
            issuedBooks
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user's issued books" });
    }
}));
// Get all books issued and the user ids in the date ranges
exports.transactionsRouter.get("/issued-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
            return res.status(400).json({ error: "Start date and end date are required and must be strings" });
        }
        const fixDateString = (dateString) => dateString.replace(' ', '+');
        const startDateFixed = fixDateString(startDate);
        const endDateFixed = fixDateString(endDate);
        console.log("startDate", new Date(startDateFixed));
        console.log("endDate", new Date(endDateFixed));
        // Find transactions within the date range
        const transactions = yield db_2.Transaction.find({
            issueDate: {
                $gte: new Date(startDateFixed),
                $lte: new Date(endDateFixed)
            },
            returnDate: null // Assuming null returnDate means the book is still issued
        }).populate({
            path: 'userId',
            model: db_1.User
        }).populate('bookName');
        // Extract book and user information from transactions
        const issuedBooks = transactions.map(transaction => ({
            bookName: transaction.bookName,
            userId: transaction.userId,
        }));
        res.json({
            startDate,
            endDate,
            issuedBooks
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching issued books" });
    }
}));
module.exports = { transactionsRouter: exports.transactionsRouter };
