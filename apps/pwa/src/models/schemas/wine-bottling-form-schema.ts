import { BottleWineAction } from "@/models/types/actions";
import Joi from "joi";
import { TimestampOrString } from "../../models/schemas/grape-schema";
import { Bottle } from "../types/db";
import { teamMemberSchema } from "./vineyard-schema";

export const wineBottlingSchema = Joi.object<Bottle>({
  id: Joi.string().required(),
  type: Joi.string().required(),
  executionDate: TimestampOrString.required().messages({
    "any.required": "Please select a date",
    "alternatives.types": "Date must be a valid date",
  }),
  collectionName: Joi.string().min(2).max(50).required().messages({
    "any.required": "Please enter a collection name",
    "string.empty": "Please enter a collection name",
    "string.min": "Collection name must be at least 2 characters long",
    "string.max":
      "Collection name must be less than or equal to 50 characters long",
  }),
  vintage: Joi.number().min(1900).required().messages({
    "any.required": "Please select a vintage",
    "number.empty": "Please select a vintage",
    "number.base": "Please select a vintage",
    "number.min": "Please select a vintage",
  }),
  subjectRecipe: Joi.string().optional(),
  wines: Joi.array().items().required().messages({
    "any.required": "At least one wine must be provided",
    "array.base": "At least one wine must be provided",
    "array.includesRequiredUnknowns": "At least one wine must be provided",
  }),
  responsible: teamMemberSchema.optional(),
  lotId: Joi.string().min(2).max(50).required().messages({
    "any.required": "Please enter the Lot ID",
    "string.empty": "Please enter the Lot ID",
    "string.min": "Lot ID must be at least 2 characters long",
    "string.max": "Lot ID must be less than or equal to 50 characters long",
  }),
  bottlingLine: Joi.string().optional().min(2).max(50).messages({
    "string.min": "Bottling line must be at least 2 characters long",
    "string.max":
      "Bottling line must be less than or equal to 50 characters long",
  }),
  bottleType: Joi.string().min(2).max(50).required().messages({
    "any.required": "Please select a bottle type",
    "string.empty": "Please select a bottle type",
    "string.min": "Bottle type must be at least 2 characters long",
    "string.max":
      "Bottle type must be less than or equal to 50 characters long",
  }),
  bottleSize: Joi.number().min(0).max(1).required().messages({
    "number.base": "Bottle size must be a number",
    "number.min": "Bottle size must be at least 1",
    "any.required": "Please select a size for the bottle",
  }),
  closureType: Joi.string().min(2).max(50).required().messages({
    "any.required": "Please select a closure type",
    "string.empty": "Please select a closure type",
    "string.min": "Closure type must be at least 2 characters long",
    "string.max":
      "Closure type must be less than or equal to 50 characters long",
  }),
  capsuleType: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Capsule type must be at least 2 characters long",
    "string.max":
      "Capsule type must be less than or equal to 50 characters long",
  }),
  labelType: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Label type must be at least 2 characters long",
    "string.max": "Label type must be less than or equal to 50 characters long",
  }),
  bottleWeight: Joi.number().min(1).max(100_000).optional().messages({
    "any.required": "Please enter a valid bottle weight",
    "number.empty": "Please enter a valid bottle weight",
    "number.base": "Please enter a valid bottle weight",
    "number.min": "Please enter a valid bottle weight",
    "number.max": "Bottle weight cannot exceed 1000",
  }),
  packagingType: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Packaging type must be at least 2 characters long",
    "string.max":
      "Packaging type must be less than or equal to 50 characters long",
  }),
  bottlesPerBox: Joi.number().min(1).max(1000).optional().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
    "number.min": "Please enter a valid number",
    "number.max": "Bottles per box cannot exceed 1000",
  }),
  packagingMaterial: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Packaging material must be at least 2 characters long",
    "string.max":
      "Packaging material must be less than or equal to 50 characters long",
  }),
  palletId: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Pallet ID must be at least 2 characters long",
    "string.max": "Pallet ID must be less than or equal to 50 characters long",
  }),
  alcohol: Joi.number().precision(2).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
  }),
  sugar: Joi.number().precision(2).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
  }),
  pH: Joi.number().precision(2).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
  }),
  totalSO2: Joi.number().precision(2).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
  }),
  freeSO2: Joi.number().precision(2).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
  }),
  turbidity: Joi.number().precision(2).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
  }),
  labCertificateId: Joi.string().optional().min(2).max(50).messages({
    "any.required": "Please enter the lab certificate ID",
    "string.empty": "Please enter the lab certificate ID",
    "string.min": "Lab certificate ID must be at least 2 characters long",
    "string.max":
      "Lab certificate ID must be less than or equal to 50 characters long",
  }),
  numberOfBottles: Joi.number().min(1).max(1_000_000_000).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
    "number.min": "Please enter a valid number",
    "number.max": "Total number of bottles cannot exceed 1 000 000 000",
  }),
  losses: Joi.number().min(1).max(1_000_000_000).required().messages({
    "any.required": "Please enter a valid number",
    "number.empty": "Please enter a valid number",
    "number.base": "Please enter a valid number",
    "number.min": "Please enter a valid number",
    "number.max": "Total losses cannot exceed 1 000 000 000",
  }),
  supportingDocuments: Joi.array()
    .items({
      name: Joi.string().optional().allow(""),
      url: Joi.string().optional().allow(""),
    })
    .optional(),
  group: Joi.array().items(Joi.string().optional().allow("")),
});
