"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_1 = require("./books");
const users_1 = require("./users");
const bookIssue_1 = require("./bookIssue");
const transactions_1 = require("./transactions");
const router = express_1.default.Router();
router.use("/books", books_1.bookRouter);
router.use("/users", users_1.userRouter);
router.use("/bookIssue", bookIssue_1.bookIssueRouter);
router.use("/transactions", transactions_1.transactionsRouter);
exports.default = router;
