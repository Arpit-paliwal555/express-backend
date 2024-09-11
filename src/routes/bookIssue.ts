import { Router } from "express";
import { User } from "../db";
import { Transaction, Book } from "../db";

export const bookIssueRouter:Router = Router();

bookIssueRouter.put("/issue-book", async (req, res) => {
  try {
    const { bookName, userId, issueDate } = req.body;
    if (!bookName || !userId || !issueDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const isAlphabetic = (input: string) => /^[A-Za-z]+$/.test(input);

    if(!isAlphabetic(userId)){
        const newTransaction = new Transaction({
            userId,
            bookName,
            issueDate
        });
        await newTransaction.save();
        res.status(200).json({ message: "Book issued successfully", transaction: newTransaction });
    }else{
        const user = await User.findById(userId);
        if(user){
            const searchedId:string = user._id.toString();
            const newTransaction = new Transaction({
                userId:searchedId,
                bookName,
                issueDate
                });
                await newTransaction.save();
                res.status(200).json({ message: "Book issued successfully", transaction: newTransaction });
        }else{
            res.status(404).json({ error: "User not found" });
        }
    }
}
   catch (error) {
    console.error("Error issuing book:", error);
    res.status(500).json({ error: "Internal server error" });
   
  }
});

bookIssueRouter.put("/return-book", async (req, res) => {
  try {
    const {  userId, bookName, returnDate } = req.body;
    if ( !userId ||!bookName || !returnDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    //function check if given user id is given or name
    const isAlphabetic = (input: string) => /^[A-Za-z]+$/.test(input);

    var transaction = null;
    // if number is numeric it is an id
    if(!isAlphabetic(userId)){
        transaction = await Transaction.findOne({
            userId,
            bookName            
        });
    }else{
        const user = await User.findById(userId);
        if(user){
            const searchedId:string = user._id.toString();
            transaction = await Transaction.findOne({
                bookName,
                userId:searchedId
            });
        }else{
           return res.status(404).json({ error: "User with given name not found" });
        }
    }
   

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const issueDate = new Date(transaction.issueDate);
    const returnDateObj = new Date(returnDate);
    const daysRented = Math.ceil((returnDateObj.getTime() - issueDate.getTime()) / (1000 * 3600 * 24));
    
    const rentPerDay = async()=>{
        try{
            const book = await Book.findOne({name: bookName});
            return book?book.rentPerDay:1;
        }catch(error){
            console.log(error);
            return 1;
        }
       
       
    } 
    const rentPerDayValue = await rentPerDay();
    const totalRent = daysRented * rentPerDayValue;

    transaction.returnDate = returnDate;
    const status = "RETURNED";
    transaction.rentAmount = totalRent;

    await transaction.save();

    res.status(200).json({
      message: "Book returned successfully",
      status: status,
      transaction: transaction,
      rentAmount: totalRent
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = {bookIssueRouter};