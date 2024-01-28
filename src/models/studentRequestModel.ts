import mongoose, { Schema, model } from "mongoose";

let StudentRequestSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    status: { type: String, default: 'waiting', enum: ['waiting', 'approved', 'declined'] },
    requestDate: Date,
    decisionDate: Date
})

export const StudentRequest = model('StudentRequest', StudentRequestSchema);