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
exports.BookModel = exports.Book = exports.GENRES = void 0;
const mongoose_1 = require("mongoose");
exports.GENRES = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'];
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, "Title is required"] },
    author: { type: String, required: [true, "Author is required"] },
    genre: { type: String, required: true, enum: { values: exports.GENRES, message: "Genre is not valid" } },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    copies: { type: Number, required: true,
        min: [0, "Copies must be a positive number"],
        validate: {
            validator: Number.isInteger,
            message: "Copies must be an integer"
        }
    },
    available: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
bookSchema.methods.syncAvailability = function () { this.available = this.copies > 0; };
bookSchema.statics.decrementCopies = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            const err = new Error("Quantity must be a positive integer");
            err.status = 400;
            throw err;
        }
        const updated = yield this.findOneAndUpdate({ _id: bookId, copies: { $gte: quantity } }, [
            { $set: { copies: { $subtract: ["$copies", quantity] } } },
            { $set: { available: { $gt: ["$copies", quantity] } } }
        ], { new: true });
        if (!updated) {
            const err = new Error("Book not found or insufficient copies");
            err.status = 404;
            throw err;
        }
        return updated;
    });
};
bookSchema.pre('save', function (next) {
    this.syncAvailability();
    next();
});
bookSchema.post('save', function (doc) {
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
exports.BookModel = (0, mongoose_1.model)('Book', bookSchema);
