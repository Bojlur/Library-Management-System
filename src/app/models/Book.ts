import mongoose, { InferSchemaType, Model, model, Schema } from "mongoose";

export const GENRES = ['FICTION','NON_FICTION','SCIENCE','HISTORY','BIOGRAPHY','FANTASY'] as const;

const bookSchema = new Schema({
    title: {type: String, required: [true, "Title is required"]},
    author: {type: String, required: [true, "Author is required"]},
    genre: {type: String, required: true, enum: {values: GENRES, message: "Genre is not valid"}},
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default:''},
    copies: {type: Number, required: true,
                min: [0, "Copies must be a positive number"],
                validate: {
                    validator: Number.isInteger,
                    message: "Copies must be an integer"
                }
            },
    available: { type: Boolean, default: true }
},{
    timestamps: true,
    versionKey: false
});

bookSchema.methods.syncAvailability = function() { this.available = this.copies > 0; };

bookSchema.statics.decrementCopies = async function(this: typeof Book, bookId: string, quantity: number) {
    if(!Number.isInteger(quantity) || quantity <= 0) {
        const err: any = new Error("Quantity must be a positive integer");
        err.status = 400;
        throw err;
    }
    const updated = await this.findOneAndUpdate(
        { _id: bookId, copies: { $gte: quantity } },
        [
            { $set: { copies: { $subtract: ["$copies", quantity] } } },
            {$set: { available: {$gt: ["$copies", quantity] } } }
        ],
        { new: true }
    );
    if(!updated) {
        const err: any = new Error("Book not found or insufficient copies");
        err.status = 404;
        throw err;
    }
    return updated;
} as any;

bookSchema.pre('save', function(next) {
    (this as any).syncAvailability();
    next();
});
bookSchema.post('save', function(doc) {
    
});

export const Book = model("Book", bookSchema);
export type Book = InferSchemaType<typeof bookSchema> & { syncAvailability(): void; };
export interface BookModel extends Model<Book> { decrementCopies(bookId: string, qty: number): Promise<Book>; }
export const BookModel = model<Book, BookModel>('Book', bookSchema);