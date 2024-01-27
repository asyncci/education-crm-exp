import { Request, Response } from "express";
import { AcademicArea } from "../../models/academicAreaModel";

/// Available course areas
export async function addAcademicArea(req: Request, res: Response) {    
    const newArea = new AcademicArea(req.body);
    return await newArea
        .save()
        .then((obj) => res.send({ success: true, message: 'Academic area was added', data: { academicArea: obj } }))
        .catch(() => res.status(500).send({ success: false, error: "Can't store `Academic Area` in database" }))
}
/// delete course
export async function deleteAcademicArea(req: Request, res: Response) {
    const id = req.body.academicAreaId;

    return await AcademicArea.deleteOne({ _id: id })
        .then(() => res.send({ success: true, message: 'Academic area deleted' }))
        .catch(() => res.status(500).send({ success: false, error: "Can't delete `academic area`" }))
}

///NOT ONLY FOR CURATOR
export async function getAcademicAreas(_: Request, res: Response) {
    const areas = await AcademicArea.find({});
    return res.send({ success: true, academicAreas: areas })
}