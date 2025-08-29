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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Borrow_1 = require("../models/Borrow");
const Book_1 = require("../models/Book");
const borrowRouter = express_1.default.Router();
borrowRouter.post('/create-borrow', function borrowBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { book, quantity, dueDate } = req.body;
        yield Book_1.BookModel.decrementCopies(book, quantity);
        const borrow = yield Borrow_1.BorrowModel.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow
        });
    });
});
borrowRouter.get('/', function borrowedSummary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield Borrow_1.BorrowModel.aggregate([
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
});
exports.default = borrowRouter;
