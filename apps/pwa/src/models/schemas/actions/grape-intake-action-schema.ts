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
   certificatDeInofensivitate?: string;
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
import { TimestampOrString } from "../grape-schema";

export const grapeIntakeActionSchema = Joi.object<GrapeIntakeAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  executionDate: TimestampOrString.required().messages({
    "any.required": "Please select a date",
    "alternatives.types": "Date must be a valid date.",
  }),
  subjectGrape: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  })
    .required()
    .messages({
      "any.required": "Please select a Batch ID",
      "string.empty": "Please select a Batch ID",
    }),
  supplier: Joi.object({
    companyName: Joi.string().required().min(2).max(50).messages({
      "any.required": "Please enter a supplier name",
      "string.empty": "Please enter a supplier name",
      "string.min": "Supplier name must be at least 2 characters long",
      "string.max":
        "Supplier name must be less than or equal to 50 characters long",
    }),
  }).required(),
  grapeVariety: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter a grape variety",
    "string.empty": "Please enter a grape variety",
    "string.min": "Grape variety must be at least 2 characters long",
    "string.max":
      "Grape variety must be less than or equal to 50 characters long",
  }),
  certificatDeInofensivitate: Joi.string().min(2).max(50).required().messages({
    "any.required": "Please enter the certificat de inofensivitate ID",
    "string.empty": "Please enter the certificat de inofensivitate ID",
    "string.min":
      "The certificat de inofensivitate ID must be at least 2 characters long",
    "string.max":
      "The certificat de inofensivitate ID must be less than or equal to 50 characters long",
  }),
  weigherName: Joi.object().optional(),
  mass: Joi.object({
    gross: Joi.number()
      .required()
      .min(0)
      .max(1_000_000_000)
      .precision(2)
      .messages({
        "any.required": "Please enter a valid number for the gross weight",
        "number.empty": "Please enter a valid number for the gross weight",
        "number.base": "Please enter a valid number for the gross weight",
        "number.min": "Please enter a valid number for the gross weight",
        "number.max": "Gross weight cannot exceed 1 000 000 000.",
      }),
    net: Joi.number()
      .required()
      .min(0)
      .max(1_000_000_000)
      .precision(2)
      .messages({
        "any.required": "Please enter a valid number for the net weight",
        "number.empty": "Please enter a valid number for the net weight",
        "number.base": "Please enter a valid number for the net weight",
        "number.min": "Please enter a valid number for the net weight",
        "number.max": "Net weight cannot exceed 1 000 000 000.",
      }),
    tare: Joi.number()
      .required()
      .min(0)
      .max(1_000_000_000)
      .precision(2)
      .messages({
        "any.required": "Please enter a valid number for the tare weight",
        "number.empty": "Please enter a valid number for the tare weight",
        "number.base": "Please enter a valid number for the tare weight",
        "number.min": "Please enter a valid number for the tare weight",
        "number.max": "Tare weight cannot exceed 1 000 000 000.",
      }),
  }).required(),
  qualityCharacteristics: Joi.object({
    temperature: Joi.number()
      .min(-200)
      .max(1_000)
      .precision(2)
      .required()
      .messages({
        "any.required": "Please enter a valid number for the temperature",
        "number.empty": "Please enter a valid number for the temperature",
        "number.base": "Please enter a valid number for the temperature",
        "number.min": "Please enter a valid number for the temperature",
        "number.max": "Temperature cannot exceed 1 000.",
      }),
    density: Joi.number().min(0).max(1_000).precision(2).required().messages({
      "any.required": "Please enter a valid number for the density",
      "number.empty": "Please enter a valid number for the density",
      "number.base": "Please enter a valid number for the density",
      "number.min": "Please enter a valid number for the density",
      "number.max": "Density cannot exceed 1 000.",
    }),
    sugar: Joi.number()
      .min(0)
      .max(10_000_000)
      .precision(2)
      .required()
      .messages({
        "any.required": "Please enter a valid number for the sugar",
        "number.empty": "Please enter a valid number for the sugar",
        "number.base": "Please enter a valid number for the sugar",
        "number.min": "Please enter a valid number for the sugar",
        "number.max": "Sugar cannot exceed 10 000 000.",
      }),
    acidity: Joi.number().precision(2).optional(),
    massFractionSpoiled: Joi.number()
      .min(0)
      .max(100)
      .precision(2)
      .required()
      .messages({
        "any.required": "Please enter a valid number for the affected grapes",
        "number.empty": "Please enter a valid number for the affected grapes",
        "number.base": "Please enter a valid number for the affected grapes",
        "number.min": "Please enter a valid number for the affected grapes",
        "number.max": "Affected grapes cannot exceed 100.",
      }),
    massFractionCrushed: Joi.number()
      .min(0)
      .max(100)
      .precision(2)
      .required()
      .messages({
        "any.required": "Please enter a valid number for the crushed grapes",
        "number.empty": "Please enter a valid number for the crushed grapes",
        "number.base": "Please enter a valid number for the crushed grapes",
        "number.min": "Please enter a valid number for the crushed grapes",
        "number.max": "Affected grapes cannot exceed 100.",
      }),
    massFractionMixed: Joi.number()
      .min(0)
      .max(100)
      .precision(2)
      .required()
      .messages({
        "any.required": "Please enter a valid number for the mixed grapes",
        "number.empty": "Please enter a valid number for the mixed grapes",
        "number.base": "Please enter a valid number for the mixed grapes",
        "number.min": "Please enter a valid number for the mixed grapes",
        "number.max": "Mixed grapes cannot exceed 100.",
      }),
  }).required(),
  labCertificateId: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter the lab certificate ID",
    "string.empty": "Please enter the lab certificate ID",
    "string.min": "Lab certificate ID must be at least 2 characters long",
    "string.max":
      "Lab certificate ID must be less than or equal to 50 characters long",
  }),
  labTechnicianName: Joi.string().required().min(2).max(50).messages({
    "any.required": "Please enter the lab technician name",
    "string.empty": "Please enter the lab technician name",
    "string.min": "Lab tehcnician name must be at least 2 characters long",
    "string.max":
      "Lab tehcnician name must be less than or equal to 50 characters long",
  }),
  processingLocation: Joi.string().optional().allow(""),
  invoiceNumber: Joi.string().optional().allow(""),
  transportInfo: Joi.object({
    companyName: Joi.string().optional().allow(""),
    vehicleId: Joi.string().optional().allow(""),
    driverId: Joi.string().optional().allow(""),
  }).optional(),
  supportingDocuments: Joi.array()
    .items({
      name: Joi.string().optional().allow(""),
      url: Joi.string().optional().allow(""),
    })
    .optional(),
  additionalInfo: Joi.string().optional().allow(""),
});
