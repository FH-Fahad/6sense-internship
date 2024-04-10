import * as dynamoose from "dynamoose";

export const BookSchema = new dynamoose.Schema({
    bookId: Number,
    bookName: String,
}, {
    timestamps: true,
});
