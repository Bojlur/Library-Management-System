import express, { Request, Response } from 'express';
import { BookModel, GENRES } from '../models/Book';

export const bookRoutes = express.Router();

bookRoutes.post('/create-book',
    async function createBook(req: Request, res: Response) {
        try {
            const book = await BookModel.create(req.body);

            res.status(201).json({
                success: true,
                message: "Book created successfully",
                data: book
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
                error: error
            });
        }
    });

bookRoutes.get('/',
    async function getBooks(req: Request, res: Response) {
        try {
            const { filter, sortBy = 'createdAt', sort = 'asc', limit = 100 } = req.query as any;
            const query: any = {};
            if (filter && GENRES.includes(filter)) query.genre = filter;
            const sortDir = sort === 'desc' ? -1 : 1;
            const books = await BookModel.find(query).sort({ [sortBy]: sortDir as 1 | -1 }).limit(Math.max(parseInt(limit), 1));

            res.status(200).json({
                success: true,
                message: "Books retrieved successfully",
                data: books
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: "Not found",
                error: error
            });
        }

    });

bookRoutes.get('/:bookId',
    async function getBookById(req: Request, res: Response) {
        try {
            const book = await BookModel.findById(req.params.bookId);

            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found",
                    error: { name: 'NotFoundError' }
                });
            }

            res.status(200).json({
                success: true,
                message: "Single Book retrieved successfully",
                data: book
            });
        } catch (error: any) {
            return res.status(404).json({
                success: false,
                message: error.message,
                error: error
            });
        }

    });

bookRoutes.put('/:bookId', async function updateBook(req: Request, res: Response) {
    try {
        const bookId = req.params.bookId;
        const updatedData = req.body;

        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No update data provided'
            });
        }

        const book = await BookModel.findByIdAndUpdate(
            bookId,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
                error: { name: 'NotFoundError' }
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
});


bookRoutes.delete('/:bookId',
    async function deleteBook(req: Request, res: Response) {
        const deleted = await BookModel.findByIdAndDelete(req.params.bookId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
                error: { name: 'NotFoundError' }
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    });

export default bookRoutes;
