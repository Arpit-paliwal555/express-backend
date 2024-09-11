import express from 'express';
import { Router } from 'express';
import {bookRouter} from './books';
import {userRouter} from './users';
import {bookIssueRouter} from './bookIssue';
import {transactionsRouter} from './transactions';

const router: Router = express.Router();


router.use("/books",bookRouter);
router.use("/users",userRouter);
router.use("/bookIssue",bookIssueRouter);
router.use("/transactions",transactionsRouter);

export default router;
