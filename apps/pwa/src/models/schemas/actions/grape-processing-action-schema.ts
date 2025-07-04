import { GrapeProcessingAction } from "@/models/types/actions";
import Joi from "joi";
import { Timestamp } from "firebase/firestore";

export const grapeProcessingActionSchema = Joi.object<GrapeProcessingAction>({
  id: Joi.string().required(),
  batchId: Joi.string().required().messages({
    "any.required": "Please select a Batch ID.",
    "string.empty": "Please select a Batch ID.",
    "string.min": "Batch ID must be at least 2 characters long.",
    "string.max": "Batch ID must be less than or equal to 50 characters long.",
  }),
  executionDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      })
    )
    .required()
    .messages({
      "any.required": "Please select a date",
      "alternatives.types": "Date must be a valid date.",
    }),
  type: Joi.string().required(),
  quantity: Joi.number()
    .min(0)
    .max(1_000_000)
    .precision(2)
    .required()
    .messages({
      "any.required": "Please enter a valid number for the grape weight",
      "number.empty": "Please enter a valid number for the grape weight",
      "number.base": "Please enter a valid number for the grape weight",
    }),
  labReport: Joi.object({
    id: Joi.string().allow("").optional(),
    date: Joi.date().optional(),
    units: Joi.string().allow("").optional(),
    supportingDocs: Joi.array().items(Joi.string()).optional(),
    responsible: Joi.object({
      name: Joi.string().optional().allow(""),
      email: Joi.string().optional().allow(""),
    }).optional(),
    results: Joi.object({
      sugar: Joi.object({
        value: Joi.number().precision(2).optional(),
        variation: Joi.number().precision(2).optional(),
      }),
      acidity: Joi.object({
        value: Joi.number().precision(2).optional(),
        variation: Joi.number().precision(2).optional(),
      }),
    }).optional(),
  }).optional(),
  receivingBay: Joi.object().optional(),
  destemmer: Joi.object().optional(),
  press: Joi.object().optional(),
  pressPercentage: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        mustId: Joi.string().allow("").optional(),
        inputQuantity: Joi.number().precision(2).optional(),
        newPressPercentage: Joi.number()
          .min(0)
          .max(100)
          .precision(2)
          .optional()
          .messages({
            "any.required": "Please enter a valid number",
            "number.empty": "Please enter a valid number",
            "number.base": "Please enter a valid number",
            "number.min": "Please enter a valid number",
            "number.max": "Press percentage cannot exceed 100.",
          }),
        vessels: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required(),
              name: Joi.string().allow("").optional(),
              qty: Joi.number()
                .min(0)
                .max(1_000_000)
                .precision(2)
                .optional()
                .messages({
                  "any.required": "Please enter a valid number",
                  "number.empty": "Please enter a valid number",
                  "number.base": "Please enter a valid number",
                  "number.min": "Please enter a valid number",
                  "number.max": "Press percentage cannot exceed 100.",
                }),
              location: Joi.string().allow("").optional(),
              type: Joi.string().allow("").optional(),
            }).optional()
          )
          .optional(),
      }).optional()
    )
    .optional(),
  wasteQuantity: Joi.number().optional(),
});
