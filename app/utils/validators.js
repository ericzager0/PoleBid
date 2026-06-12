import AppError from "./appError.js";

export const requireString = (value, fieldName) => {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new AppError(`El campo ${fieldName} es obligatorio`, 400);
  }
  return value.trim();
};

export const requireNumber = (value, fieldName) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new AppError(`El campo ${fieldName} es obligatorio`, 400);
  }
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new AppError(`El campo ${fieldName} debe ser un número válido`, 400);
  }
  return parsed;
};

export const resolveFile = (files, file, fieldName) =>
  Array.isArray(files?.[fieldName])
    ? files[fieldName][0]
    : (files?.[fieldName] ?? (file?.fieldname === fieldName ? file : null));
