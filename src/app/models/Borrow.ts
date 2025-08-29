import mongoose, { InferSchemaType, Schema } from "mongoose";


const borrowSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
   quantity: {
       type: Number,
       required: true,
       min: [1, 'Quantity must be at least 1'], validate:{
           validator: Number.isInteger,
           message: 'Quantity must be an integer'
       }
   },
   dueDate: {
       type: Date,
       required: true
   }
},{
    timestamps: true,
    versionKey: false
});

borrowSchema.pre('validate', function(next) {
    if (this.dueDate && new Date(this.dueDate).getTime() <=Date.now()) {
        this.invalidate('dueDate', 'Due date must be a future date');
    }
    next();
});

export type Borrow = InferSchemaType<typeof borrowSchema>;
export const BorrowModel = mongoose.model<Borrow>('Borrow', borrowSchema);