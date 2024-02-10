import mongoose, { Schema, model } from "mongoose";

let TestimonialsSchema = new Schema({
    rating: {type: Number, default: 5.0},
    comment: String,
    date: Date,
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' }
})

export const StudentTestimonial = model('StudentTestimonial', TestimonialsSchema);