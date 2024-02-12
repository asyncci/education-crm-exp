import mongoose, { Schema, Document, model } from "mongoose";
import { AcademicArea } from "./academicAreaModel";
import { User } from "./userModel";

let MentorSchema = new Schema({
    firstName: String,
    lastName: String,
    subject: [ { type: Schema.Types.ObjectId, ref: AcademicArea } ],
})

export const MentorProfile = model('MentorProfile', MentorSchema);


let StudentSchema = new Schema({
    nameChinese: String,
    nameEnglish: String,
    profilePhoto: String,
    studentContacts: [{
        owner: { type: String, default: 'student', enum: ['student', 'parent'] },
        contactService: { type: Schema.Types.ObjectId, ref: 'ContactService' },
        contactValue: String
    }],
    parentContacts: [{
        owner: { type: String, default: 'parent', enum: ['student', 'parent'] },
        contactService: { type: Schema.Types.ObjectId, ref: 'ContactService' },
        contactValue: String
    }],
    school: String,
    accountLogin: String,
    accountEmail: String,
    // user: { type: Schema.Types.ObjectId, ref: 'User'},
    // currentAndPastCourses:[{ type: Schema.Types.ObjectId, ref: 'ActiveCourse'}],
    // likedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course'}],
    // oneToOneClasses:[{type: Schema.Types.ObjectId, ref: 'OneToOneClass'}],
    // certificates:[{type: Schema.Types.ObjectId, ref: 'Certificate'}],
    // recommendationLetters:[{type: Schema.Types.ObjectId, ref: 'RecommendationLetter'}]
})


let ContactServiceSchema = new Schema({
contactService:String
})
export const ContactService = model('ContactService', ContactServiceSchema)
export const StudentProfile = model('StudentProfile', StudentSchema);
