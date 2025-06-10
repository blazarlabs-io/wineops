/** 
 * 
 export type GrapeIntakeAction = {
   id: string;
   type: GrapeActionType;
   executionDate: string | Timestamp;
   supplier?: string;
   grapeVariety?: string;
   weigherName?: ResponsibleTeamMember;
   mass?: {
     gross?: number;
     net?: number;
     tare?: number;
   };
   qualityCharacteristics?: {
     sugar?: number;
     acidity?: number;
     density?: number;
     temperature?: number;
     massFractionSpoiled?: number;
     massFractionCrushed?: number;
     massFractionMixed?: number;
   };
   labCertificateId?: string;
   certificateDeInofensiviate?: string;
   labTechnicianName?: string;
   transportInfo?: {
     vehicleId?: string;
     companyName?: string;
     driverId?: string;
   };
   invoiceNumber?: string;
   supportingDocument?: SingleDocument;
 };
 * 
*/

import { GrapeIntakeAction } from "@/models/types/actions";
import Joi from "joi";

export const grapeIntakeActionSchema = Joi.object<GrapeIntakeAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  executionDate: Joi.date().required(),
  subjectGrape: Joi.object({
    id: Joi.string().optional().allow(""),
    name: Joi.string().optional().allow(""),
  }).optional(),
  supplier: Joi.string().optional().allow(""),
  grapeVariety: Joi.string().optional().allow(""),
  weigherName: Joi.object({
    name: Joi.string().optional().allow(""),
    email: Joi.string().optional().allow(""),
  }).optional(),
  mass: Joi.object({
    gross: Joi.number().precision(2).optional(),
    net: Joi.number().precision(2).optional(),
    tare: Joi.number().precision(2).optional(),
  }).optional(),
  qualityCharacteristics: Joi.object({
    sugar: Joi.number().precision(2).optional(),
    acidity: Joi.number().precision(2).optional(),
    density: Joi.number().precision(2).optional(),
    temperature: Joi.number().precision(2).optional(),
    massFractionSpoiled: Joi.number().precision(2).optional(),
    massFractionCrushed: Joi.number().precision(2).optional(),
    massFractionMixed: Joi.number().precision(2).optional(),
  }).optional(),
  labCertificateId: Joi.string().optional().allow(""),
  certificateDeInofensiviate: Joi.string().optional().allow(""),
  labTechnicianName: Joi.string().optional().allow(""),
  transportInfo: Joi.object({
    vehicleId: Joi.string().optional().allow(""),
    companyName: Joi.string().optional().allow(""),
    driverId: Joi.string().optional().allow(""),
  }).optional(),
  invoiceNumber: Joi.string().optional().allow(""),
  supportingDocument: Joi.object({
    name: Joi.string().optional().allow(""),
    fileUrl: Joi.string().optional().allow(""),
  }),
});
