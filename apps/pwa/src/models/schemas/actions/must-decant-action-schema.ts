import { MustDecantAction } from "@/models/types/actions";
import { Timestamp } from "firebase/firestore";
import Joi from "joi";

export const mustDecantActionSchema = Joi.object<MustDecantAction>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  subjectMust: Joi.object().optional(),
  executionDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Date must be a valid date.",
        "string.base": "Date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Date must be a valid date.",
      }),
    )
    .required()
    .messages({
      "any.required": "Date is required.",
      "alternatives.types": "Date must be a valid date.",
    }),

  mustId: Joi.string().required().messages({
    "any.required": "Must is required.",
    "string.empty": "Must cannot be empty.",
  }),
  vesselId: Joi.string().required().messages({
    "any.required": "Vessel is required.",
    "string.empty": "Vessel cannot be empty.",
  }),
  initialQty: Joi.number().min(0).precision(2).required().messages({
    "number.base": "Initial quantity must be a number",
    "number.min": "Initial quantity must be at least 1",
    "any.required": "Please enter initial quantity",
  }),
  consumables: Joi.array().items().optional(),
  obtainedWineQty: Joi.number().min(0).precision(2).required().messages({
    "number.base": "Obtained quantity must be a number",
    "number.min": "Obtained quantity must be at least 1",
    "any.required": "Please enter obtained quantity",
  }),
  vessels: Joi.array().items().required().messages({
    "any.required": "At least one vessel must be provided.",
  }),
  wasteQuantity: Joi.number().min(0).precision(2).optional(),
  wasteUnit: Joi.string().optional(),
  notes: Joi.string().optional(),
  moveToWine: Joi.boolean().optional(),
  wineName: Joi.string().required().messages({
    "any.required": "Name is required.",
  }),
});
