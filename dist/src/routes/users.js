import { Router } from "express";
import { User } from "../db";
export const userRouter = Router();
userRouter.post("/add", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.create({ name, email });
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
});
userRouter.get("/userById", async (req, res) => {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
});
userRouter.get("/all", async (req, res) => {
    const users = await User.find();
    res.status(200).json({ users });
});
module.exports = { userRouter };
