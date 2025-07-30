"use strict";

import {
  Location,
  Note,
  Task,
  TeamMember,
  Vines,
  Vineyard,
  VineyardInfo,
} from "@/models/types/db";
import { Timestamp } from "firebase/firestore";
import Joi from "joi";

const locationSchema = Joi.object<Location>({
  map: Joi.array()
    .items(
      Joi.object({
        lat: Joi.number().optional(),
        lng: Joi.number().optional(),
      }),
    )
    .optional(),
  surface: Joi.number()
    .empty("")
    .min(0.01)
    .max(100000)
    .messages({
      "number.min": "Surface must be between 0.01 and 100000",
      "number.max": "Surface must be between 0.01 and 100000",
    })
    .error(new Error("Surface must be between 0.01 and 100000"))
    .optional(),
  city: Joi.string().optional().max(50).allow("").messages({
    "string.max": "City must be less than or equal to 50 characters long",
  }),
  country: Joi.string().optional().allow(""),
  elevation: Joi.number().empty("").min(0.01).max(10000).optional().messages({
    "number.min": "Elevation must be between 0.01 and 10000",
    "number.max": "Elevation must be between 0.01 and 10000",
  }),
  orientation: Joi.string().optional().allow(""),
});

const vinesSchema = Joi.object<Vines>({
  yearOfPlantation: Joi.number().empty(""),
  plantingScheme: Joi.object({
    spacing: Joi.number().empty("").min(0.01).max(100).messages({
      "string.min": "Row orientation must be between 0.01 and 100",
      "string.max": "Row orientation must be between 0.01 and 100",
    }),
    rowOrientation: Joi.string().optional().allow(""),
    density: Joi.number().empty("").min(0.01).max(100).messages({
      "string.min": "Density must be between 0.01 and 100",
      "string.max": "Density must be between 0.01 and 100",
    }),
    trellisSystem: Joi.string().optional().allow(""),
    plantsPerHa: Joi.number().empty("").min(1).max(100000).messages({
      "string.min": "Plants per ha must be between 1 and 100000",
      "string.max": "Plants per ha must be between 1 and 100000",
    }),
  }),
  soilType: Joi.string().optional().allow("").max(50).messages({
    "string.max": "Soil type must be less than or equal to 50 characters long",
  }),
  sunlightHours: Joi.number().empty("").min(1).max(10000).messages({
    "string.min": "Sunlight hours must be between 1 and 10000",
    "string.max": "Sunlight hours must be between 1 and 10000",
  }),
});

const vineyardCertificationsSchema = Joi.object({
  eco: Joi.object({
    active: Joi.boolean().optional(),
    fileUrl: Joi.string().optional().allow(""),
  }),
  bio: Joi.object({
    active: Joi.boolean().optional(),
    fileUrl: Joi.string().optional().allow(""),
  }),
  igp: Joi.object({
    active: Joi.boolean().optional(),
    fileUrl: Joi.string().optional().allow(""),
  }),
  dop: Joi.object({
    active: Joi.boolean().optional(),
    fileUrl: Joi.string().optional().allow(""),
  }),
  ice: Joi.object({
    active: Joi.boolean().optional(),
    fileUrl: Joi.string().optional().allow(""),
  }),
}).optional();

const vineyardInfoSchema = Joi.object<VineyardInfo>({
  location: locationSchema,
  vines: vinesSchema,
  certifications: vineyardCertificationsSchema,
});

const vineyardGrapeSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  clonalSelection: Joi.string().optional().allow("").max(50).messages({
    "string.max":
      "Clonal selection must be less than or equal to 50 characters long",
  }),
  vivcNumber: Joi.string().optional().allow(""),
  countryOfOrigin: Joi.string().optional().allow(""),
}).optional();

const labDataSchema = Joi.object({
  id: Joi.string().optional().allow(""),
  fileUrl: Joi.string().optional().allow(""),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().optional().allow(""),
        name: Joi.string().optional().allow(""),
        value: Joi.number().precision(2).optional(),
        variation: Joi.number().precision(2).optional(),
        unit: Joi.string().optional().allow(""),
        responsible: Joi.object({
          name: Joi.string().optional().allow(""),
          email: Joi.string().optional().allow(""),
        }),
        date: Joi.string().optional().allow(""),
      }),
    )
    .optional(),
  date: Joi.string().optional().allow(""),
}).optional();

const TimestampOrString = Joi.alternatives().try(
  Joi.string().isoDate(),
  Joi.object().custom((value, helpers) => {
    if (value instanceof Timestamp) return value;
    return helpers.error("any.invalid");
  }, "Timestamp validation"),
);

export const teamMemberSchema = Joi.object<TeamMember>({
  id: Joi.string().optional().allow(""),
  name: Joi.string().optional().allow(""),
  lastName: Joi.string().optional().allow(""),
  email: Joi.string().optional().allow(""),
  role: Joi.string().optional().allow(""),
  avatar: Joi.string().optional().allow(""),
  department: Joi.string().optional().allow(""),
  contactPhone: Joi.string().optional().allow(""),
}).optional();

const actionRelationSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.string().optional().allow(""),
      name: Joi.string().optional().allow(""),
    }),
  )
  .optional();

const tasksSchema = Joi.object<Task>({
  id: Joi.string().optional().allow(""),
  title: Joi.string().optional().allow(""),
  description: Joi.string().optional().allow(""),
  duration: Joi.number().optional().empty(""),
  status: Joi.string().optional().allow(""),
  assignedTo: teamMemberSchema,
  createdBy: teamMemberSchema,
}).optional();

const notesSchema = Joi.object<Note>({
  id: Joi.string().optional().allow(""),
  title: Joi.string().optional().allow(""),
  content: Joi.string().optional().allow(""),
  date: TimestampOrString,
  author: teamMemberSchema,
}).optional();

export const vineyardSchema = Joi.object<Vineyard>().keys({
  id: Joi.string().required(), // * Autogenerated
  name: Joi.string().max(50).required().messages({
    "string.empty": `Vineyard name cannot be empty`,
    "string.max": `Vineyard name cannot be longer than 50 characters`,
  }),
  grapeVariety: Joi.string().max(50).required().messages({
    "string.empty": `Grape variety cannot be empty`,
    "string.max": `Grape variety cannot be longer than 50 characters`,
  }),
  grapeColor: Joi.string().max(50).required().messages({
    "string.empty": `Grape color cannot be empty`,
    "string.max": `Grape color cannot be longer than 50 characters`,
  }),
  cadastralNumber: Joi.array().items(
    Joi.string().min(2).max(50).optional().allow("").messages({
      "string.min": "Cadastral number must be at least 2 characters long",
      "string.max": `Cadastral number cannot be longer than 50 characters`,
    }),
  ),
  identificatorUnicParcela: Joi.array().items(
    Joi.string().min(2).max(50).optional().allow("").messages({
      "string.min":
        "Identificatorul unic al parcelei viticole must be at least 2 characters long",
      "string.max": `Identificatorul unic al parcelei viticole cannot be longer than 50 characters`,
    }),
  ),
  rowType: Joi.string().optional(),
  info: vineyardInfoSchema,
  grape: vineyardGrapeSchema.optional(),
  status: Joi.string().optional(),
  forecastedYield: Joi.number().empty("").default(1),
  tasks: actionRelationSchema,
  notes: actionRelationSchema,
  documents: Joi.array().items(
    Joi.object({
      id: Joi.string().optional().allow(""),
      name: Joi.string().optional().allow(""),
      fileUrl: Joi.string().optional().allow(""),
      owner: Joi.object({
        name: Joi.string().optional().allow(""),
        email: Joi.string().optional().allow(""),
      }),
      uploadDate: Joi.string().optional().allow(""),
      media: Joi.object({
        type: Joi.string().optional().allow(""),
        subtype: Joi.string().optional().allow(""),
        sizeMb: Joi.number().precision(2).optional(),
      }),
    }),
  ),
  group: Joi.array().items(Joi.string().optional().allow("")),
  createdAt: TimestampOrString.empty("").optional(),
  actions: actionRelationSchema,
  batches: actionRelationSchema,
  labData: actionRelationSchema,
});
