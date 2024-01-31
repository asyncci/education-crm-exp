import mongoose, { Schema, model } from "mongoose";

let ReviewSchema = new Schema({
    rating: {type: Number, default: 5.0},
    comment: String,
    date: Date,
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' }
})

export const Review = model('Review', ReviewSchema);