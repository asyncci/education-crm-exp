import { Request, Response } from "express";
import { Contract, IndividualClassRequest, Interview } from "../models/coursesModels";
import { Type } from "typescript";
import { Types } from "mongoose";

export async function getAllRequests(req: Request, res: Response) {
    const list = await IndividualClassRequest.find({});
    return res.status(200).send({ success: true, data: { requests: list }})
}

export async function getApprovedRequests(req: Request, res: Response) {
    const list = await IndividualClassRequest.find({ status: "approved" });
    return res.status(200).send({ success: true, data: { requests: list }})
}

export async function getDeclinedRequests(req: Request, res: Response) {
    const list = await IndividualClassRequest.find({ status: "declined" });
    return res.status(200).send({ success: true, data: { requests: list }})
}

export async function getPendingRequests(req: Request, res: Response) {
    const list = await IndividualClassRequest.find({ status: "pending" });
    return res.status(200).send({ success: true, data: { requests: list }})
}

export async function createInterview(req: Request, res: Response) {
    const { passed, ...other } = req.body;
    const interview = new Interview(other)
    return await interview
        .save()
        .then((interview) => res.status(200).send({ success: true, message: 'Successfully created interview', data: { request: requestObj } }))
        .catch(() => res.status(500).send({ success: false, error: "Can't save interview to database" }))
}

export async function passInterview(req: Request, res: Response) {
    return await Interview.findOneAndUpdate({ _id: req.body.interviewId }, { passed: true}, { new: true })
        .then(async (doc) => {
            if (doc) 
                return res.status(200).send({ success: true, message: "Interview pass approved" })
            else
                return res.status(400).send({ success: false, error: "Interview doesn't exist" })
        })
}

export async function createRequestIndividualCourse(req: Request, res: Response) {
    const student = res.locals.student;
    const request = new IndividualClassRequest({ ...req.body , student});
    return await request
        .save()
        .then((requestObj) => res.status(200).send({ success: true, message: 'Successfully created request', data: { request: requestObj } }))
        .catch(() => res.status(500).send({ success: false, error: "Can't save request to database" }))
}

export async function approveRequest(req: Request, res: Response) {
    return await IndividualClassRequest.findOneAndUpdate({ _id: req.body.requestId }, { status: 'approved' }, { new: true })
        .then(async (doc) => {
            if (doc) {
                const first = await Interview.findById(doc.first_interview);
                const second = await Interview.findById(doc.second_interview);
                if (first?.passed && second?.passed) {
                    //create contract here
                    const fields = {
                        request: doc._id,
                        student: doc.student
                    }

                    await createContract(fields);

                    return res.status(200).send({ success: true, message: "Request approved" })
                }

                return res.status(401).send({ success: false, message: "Request not approved" })                
            }
            else
                return res.status(400).send({ success: false, error: "Request doesn't exist" })
        })
}

async function createContract(fields: any) {
    const contract = new Contract(fields);
    return await contract
        .save()
        .then((contractObj) => contractObj)
        .catch((err) => err)
}