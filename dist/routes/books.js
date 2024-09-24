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
exports.bookRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.bookRouter = (0, express_1.Router)();
exports.bookRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            return res.status(400).json({ error: "Search term is required" });
        }
        const books = yield db_1.Book.find({ name: { $regex: searchTerm, $options: 'i' } });
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found matching the search term" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error searching for books", details: error });
    }
}));
exports.bookRouter.get("/rent-range", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minRent, maxRent } = req.query;
        if (!minRent || !maxRent) {
            return res.status(400).json({ error: "Both minRent and maxRent are required" });
        }
        const books = yield db_1.Book.find({
            rentPerDay: { $gte: Number(minRent), $lte: Number(maxRent) }
        });
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found within the specified rent range" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error searching for books by rent range", details: error });
    }
}));
exports.bookRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, rentPerDay } = req.body;
    const book = new db_1.Book({ name, category, rentPerDay });
    const savedBook = yield book.save();
    res.status(201).json(savedBook);
}));
exports.bookRouter.get("/get-all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield db_1.Book.find();
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching books", details: error });
    }
}));
exports.bookRouter.get("/detail-search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, term, minRent, maxRent } = req.query;
        if (!category || !term || !minRent || !maxRent) {
            return res.status(400).json({ error: "Category, search term, minRent, and maxRent are required" });
        }
        const query = {
            category: category,
            name: { $regex: term, $options: 'i' },
            rentPerDay: { $gte: Number(minRent), $lte: Number(maxRent) }
        };
        const books = yield db_1.Book.find(query);
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found matching the search criteria" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error searching for books", details: error });
    }
}));
module.exports = { bookRouter: exports.bookRouter };
