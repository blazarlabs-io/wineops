"use strict";

import Joi from "joi";
import { BarrelInfoUsage, ToastLevel, VesselType } from "../types/db";
import { Timestamp } from "firebase/firestore";
import { VOLUME_UNITS } from "@/data/constants";

const vesselBarrelInfoSchema = Joi.object({
  usage: Joi.string()
    .valid(...Object.values(BarrelInfoUsage))
    .optional().allow(null).empty("")
    .messages({
      "any.required": "The barrel usage status is required.",
      "string.base": "The barrel usage status must be a string.",
      "any.only": `The barrel usage status must be one of the following: ${Object.values(BarrelInfoUsage).join(", ")}.`,
    }),
  manufacturer: Joi.string().optional().allow(""),
  material: Joi.string().optional().allow(""),
  toastLevel: Joi.string()
    .valid(...Object.values(ToastLevel))
    .optional().allow(null).empty("")
    .messages({
      "any.required": "The barrel toast level is required.",
      "string.base": "The barrel toast level must be a string.",
      "any.only": `The barrel toast level must be one of the following: ${Object.values(ToastLevel).join(", ")}.`,
    }),
  stavesThickness: Joi.number().optional().empty(""),
  oxygenTransmissionRate: Joi.number().optional().empty(""),
  woodGrainDensity: Joi.number().optional().empty(""),
});

const vesselSstInfoSchema = Joi.object({
  usage: Joi.number().optional().allow(null).empty("").default(null).messages({
    "number.base": "Usage must be a number.",
  }),
  materialGrade: Joi.string().optional().allow(""),
  steelThickness: Joi.number().optional().empty(""),
  coolingJacketsCoils: Joi.boolean().optional().empty(""),
  insulationLayers: Joi.boolean().optional().empty(""),
  pressureRating: Joi.number().optional().empty(""),
});

export const vesselSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required().messages({
    "any.required": "The vessel ID is required.",
    "string.base": "The vessel ID must be a string.",
    "string.empty": "The vessel ID cannot be empty.",
  }),
  group: Joi.array().items(Joi.string()).required(),
  rowType: Joi.string().optional(),
  type: Joi.string()
    .valid(...Object.values(VesselType))
    .required()
    .messages({
      "any.required": "The vessel type is required.",
      "string.base": "The vessel type must be a string.",
      "any.only": `The vessel type must be one of the following: ${Object.values(VesselType).join(", ")}.`,
    }),
  lastMaintenance: Joi.optional().allow("").messages({
    "alternatives.types": "Last maintenance date must be a valid date.",
  }),
  location: Joi.string().optional().allow("").messages({
    "string.base": "Location must be a string.",
  }),
  currentUsage: Joi.string().optional().allow("").messages({
    "string.base": "Current usage/batch must be a string.",
  }),
  startDate: Joi.alternatives()
    .try(
      Joi.string().isoDate().messages({
        "string.isoDate": "Start date must be a valid date.",
        "string.base": "Start date must be a valid date.",
      }),
      Joi.object().instance(Timestamp).messages({
        "object.base": "Start date must be a valid date.",
      })
    )
    .optional()
    .allow("")
    .messages({
      "alternatives.types": "Start date must be a valid date.",
    }),
  volume: Joi.number().optional().empty("").messages({
    "number.base": "Volume must be a number",
  }),
  volumeUnit: Joi.string()
    .valid(...VOLUME_UNITS)
    .when("volume", {
      is: Joi.exist(),
      then: Joi.required().messages({
        "any.required": "Volume unit is required when volume is provided.",
        "any.only": `Volume unit must be one of: ${VOLUME_UNITS.join(", ")}.`,
      }),
      otherwise: Joi.optional(),
    }),
  usage: Joi.string().optional().allow("").messages({
    "string.base": "Usage must be a string.",
  }),
  barrelInfo: vesselBarrelInfoSchema.optional(),
  sstInfo: vesselSstInfoSchema.optional(),
  status: Joi.string().optional().allow(""),
});
