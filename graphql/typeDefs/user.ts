import { gql } from 'apollo-server';

export default  gql`
type User {
  id: ID
  firstname: String
  lastname: String
  email: String
  password: String
  token: String
  restaurants: [Restaurant]
} 
input RegisterInput {
  firstname: String!
  lastname: String!
  email: String!
  password: String! 
  confirmPassword : String
}
input LoginInput {
  email: String!
  password: String!
}
input UpdateUser {
  firstname: String!
  lastname: String!
  email: String!
  restaurants: [ID]
} 
input DeleteUser {
  id: ID!
} 

type Query { 
  getUser(userId : ID!): User
  getUsers: [User]
}

type Mutation {
  registerUser(registerInput: RegisterInput): User!
  loginUser(loginInput: LoginInput): User!
  updateUser(userId : ID!, updateUserInput: UpdateUser): User
  deleteUser(deleteUserInput: DeleteUser): User
}
`;