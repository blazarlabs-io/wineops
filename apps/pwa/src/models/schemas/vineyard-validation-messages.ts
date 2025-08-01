export const vineyardValidationMessages = {
  name: {
    "string.empty": "Vineyard name cannot be empty",
    "string.max": "Vineyard name cannot be longer than 50 characters",
  },
  grapeVariety: {
    "string.empty": "Please select a grape variety",
    "string.max": "Grape variety cannot be longer than 50 characters",
  },
  grapeColor: {
    "string.empty": "Please select a grape color",
    "string.max": "Grape color cannot be longer than 50 characters",
  },
  cadastralNumber: {
    "string.min": "Cadastral number must be at least 2 characters long",
    "string.max": "Cadastral number cannot be longer than 50 characters",
  },
  identificatorUnicParcela: {
    "string.min":
      "Identificatorul unic al parcelei viticole must be at least 2 characters long",
    "string.max":
      "Identificatorul unic al parcelei viticole cannot be longer than 50 characters",
  },
} as const;
