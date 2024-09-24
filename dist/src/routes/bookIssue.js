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
exports.bookIssueRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const db_2 = require("../db");
exports.bookIssueRouter = (0, express_1.Router)();
exports.bookIssueRouter.put("/issue-book", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookName, userId, issueDate } = req.body;
        if (!bookName || !userId || !issueDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const isAlphabetic = (input) => /^[A-Za-z]+$/.test(input);
        if (!isAlphabetic(userId)) {
            const newTransaction = new db_2.Transaction({
                userId,
                bookName,
                issueDate
            });
            yield newTransaction.save();
            res.status(200).json({ message: "Book issued successfully", transaction: newTransaction });
        }
        else {
            const user = yield db_1.User.findById(userId);
            if (user) {
                const searchedId = user._id.toString();
                const newTransaction = new db_2.Transaction({
                    userId: searchedId,
                    bookName,
                    issueDate
                });
                yield newTransaction.save();
                res.status(200).json({ message: "Book issued successfully", transaction: newTransaction });
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        }
    }
    catch (error) {
        console.error("Error issuing book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.bookIssueRouter.put("/return-book", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, bookName, returnDate } = req.body;
        if (!userId || !bookName || !returnDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        //function check if given user id is given or name
        const isAlphabetic = (input) => /^[A-Za-z]+$/.test(input);
        var transaction = null;
        // if number is numeric it is an id
        if (!isAlphabetic(userId)) {
            transaction = yield db_2.Transaction.findOne({
                userId,
                bookName
            });
        }
        else {
            const user = yield db_1.User.findById(userId);
            if (user) {
                const searchedId = user._id.toString();
                transaction = yield db_2.Transaction.findOne({
                    bookName,
                    userId: searchedId
                });
            }
            else {
                return res.status(404).json({ error: "User with given name not found" });
            }
        }
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        const issueDate = new Date(transaction.issueDate);
        const returnDateObj = new Date(returnDate);
        const daysRented = Math.ceil((returnDateObj.getTime() - issueDate.getTime()) / (1000 * 3600 * 24));
        const rentPerDay = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const book = yield db_2.Book.findOne({ name: bookName });
                return book ? book.rentPerDay : 1;
            }
            catch (error) {
                console.log(error);
                return 1;
            }
        });
        const rentPerDayValue = yield rentPerDay();
        const totalRent = daysRented * rentPerDayValue;
        transaction.returnDate = returnDate;
        const status = "RETURNED";
        transaction.rentAmount = totalRent;
        yield transaction.save();
        res.status(200).json({
            message: "Book returned successfully",
            status: status,
            transaction: transaction,
            rentAmount: totalRent
        });
    }
    catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
module.exports = { bookIssueRouter: exports.bookIssueRouter };
