import { ErrorsLoginType, ErrorsRegisterType } from "./type";

export const validateRegisterInput = (
  firstname:string,
  lastname:string,
  email:string,
  password:string,
  confirmPassword:string,
) => {
  const errors:ErrorsRegisterType = {};
  if (firstname.trim() === '') {
    errors.firstname = 'Firstname must not be empty';
  }
  if (lastname.trim() === '') {
    errors.lastname = 'Lastname must not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password === '') {
    errors.password = 'Password must not empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Password must be the same';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (email:string, password:string) => {
  const errors:ErrorsLoginType = {};

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }

  if (password.trim() === '') {
    errors.password = 'Password must not empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};