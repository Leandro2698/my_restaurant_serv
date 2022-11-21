import { gql } from 'apollo-server';

export default  gql`
type Product {
  id: ID
  name: String!,
  unitSalePrice: Int!,
  stock: Int
  turnoversProductMonth: [TurnoversProductMonth!]!
  turnoversProductYear: [TurnoversProductYear!]!,
  category: String
  status: String!
  delivery: Int
  omSite: Int
} 

type TurnoversProductYear {
  id: ID
  createdAt: String, 
  turnoverYear: Int!,
  totalSales: Int!,
} 
type TurnoversProductMonth {
  id: ID
  income: Int!,
  year: String!,
  month: String!,
  day: String!,
  sales: Int!,

} 

enum STATUS { 
  draft
  published
}
enum CATEGORY {
  none
  drink
  food
  other
} 
input CreateProduct {
  name: String!,
  unitSalePrice: Int!,
  category: CATEGORY!
} 
input UpdateProduct {
  name: String!,
  status: STATUS!
  category: CATEGORY!
} 
input SoldProduct {
  unitProductSold: Int!, 
} 

type Query {
  getProduct(restaurantId : ID!, productId: ID!): Product!
  getProducts(restaurantId : ID!): [Product!]!

}
type Mutation {
  createProduct(restaurantId: ID!, createProductInput: CreateProduct! ): Restaurant!
  updateProduct(restaurantId : ID!, productId: ID!, updateProductInput: UpdateProduct!): Restaurant!
  soldProduct(restaurantId : ID!, productId: ID!, soldProductInput: SoldProduct!): Restaurant!
  deleteProduct(restaurantId: ID!, productId: ID! ): Restaurant!
}
`;
