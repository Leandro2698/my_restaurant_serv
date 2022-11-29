import { ErrorsRestaurantType } from "./type";

export const validateCreateRestaurantInput = (
  name:string,
) => {
  const errors:ErrorsRestaurantType = {};
  if (name.trim() === '') {
    errors.name = 'name must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};