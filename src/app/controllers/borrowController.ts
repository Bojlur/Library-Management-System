import express, { Request, Response } from 'express';
import { BorrowModel } from '../models/Borrow';
import { BookModel } from '../models/Book';

const borrowRouter = express.Router();

borrowRouter.post('/create-borrow',
    async function borrowBook(req: Request, res: Response) {
        const { book, quantity, dueDate } = req.body;
        await BookModel.decrementCopies(book, quantity);
        const borrow = await BorrowModel.create({ book, quantity, dueDate });

        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow
        });
    });

borrowRouter.get('/',
    async function borrowedSummary(req: Request, res: Response) {
        const book = await BorrowModel.aggregate([
            { $group: { _id: '$book', totalQuantity: { $sum: '$quantity' } } },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            { $unwind: '$book' },
            {
                $project: {
                    _id: 0,
                    book: { title: '$book.title', isbn: '$book.isbn' },
                    totalQuantity: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Borrow summary retrieved successfully",
            data: book
        });
    });


export default borrowRouter;