export type ErrorsRegisterType = {
  firstname?:string,
  lastname?:string,
  email?:string,
  password?:string,
  confirmPassword?:string,
}
export type ErrorsLoginType = {
  email?:string,
  password?:string,
  general?: string
}
export type ErrorsRestaurantType = {
  name?:string
}