import mongoose, { Schema, model } from "mongoose";

let ClassSchema = new Schema({
    academicArea: String,
    topic: String,
    status: { type: String, enum: ['not_started', 'ongoing', 'finished'] },
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile' },
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' }
})

export const OneToOneClass = model('OneToOneClass', ClassSchema);

let RequestSchema = new Schema({
    academicArea: { type: Schema.Types.ObjectId, ref: 'AcademicArea' },
    topic: String,
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
    status: { type: String, default: 'waiting', enum: ['waiting', 'approved', 'declined'] },
})

export const RequestOneToOneClass = model('RequestOneToOneClass', RequestSchema);