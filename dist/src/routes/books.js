import { Router } from "express";
import { Book } from "../db";
export const bookRouter = Router();
bookRouter.get("/search", async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            return res.status(400).json({ error: "Search term is required" });
        }
        const books = await Book.find({ name: { $regex: searchTerm, $options: 'i' } });
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found matching the search term" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error searching for books", details: error });
    }
});
bookRouter.get("/rent-range", async (req, res) => {
    try {
        const { minRent, maxRent } = req.query;
        if (!minRent || !maxRent) {
            return res.status(400).json({ error: "Both minRent and maxRent are required" });
        }
        const books = await Book.find({
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
});
bookRouter.post("/add", async (req, res) => {
    const { name, category, rentPerDay } = req.body;
    const book = new Book({ name, category, rentPerDay });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
});
bookRouter.get("/get-all", async (req, res) => {
    try {
        const books = await Book.find();
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching books", details: error });
    }
});
bookRouter.get("/detail-search", async (req, res) => {
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
        const books = await Book.find(query);
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found matching the search criteria" });
        }
        res.status(200).json(books);
    }
    catch (error) {
        res.status(500).json({ error: "Error searching for books", details: error });
    }
});
module.exports = { bookRouter };
