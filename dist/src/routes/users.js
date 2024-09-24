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
exports.userRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email } = req.body;
        const user = yield db_1.User.create({ name, email });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: "Validation error", details: error.errors });
        }
        else if (error.name === 'MongoError' && error.code === 11000) {
            res.status(409).json({ error: "Duplicate email", details: "Email already exists" });
        }
        else {
            res.status(500).json({ error: "Error creating user", details: error.message });
        }
    }
}));
exports.userRouter.get("/userById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const user = yield db_1.User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
}));
exports.userRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.User.find();
    res.status(200).json({ users });
}));
module.exports = { userRouter: exports.userRouter };
