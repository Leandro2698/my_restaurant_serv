import { gql } from 'apollo-server';

export default  gql`
type Restaurant {
  id: ID 
  name: String
  admin: User!
  products: [Product]!
  turnoversRestaurantYear: [TurnoversRestaurantYear]!

} 

type TurnoversRestaurantYear {
  id: ID
  createdAt: String, 
  turnoverYear: Int,
  totalSales: Int,
} 
input CreateRestaurant {
  name: String
} 

type Query {
  getRestaurant(restaurantId : ID!): Restaurant!
  getRestaurants: [Restaurant]
}
type Mutation {
  createRestaurant(createRestaurantInput: CreateRestaurant): Restaurant!
  deleteRestaurant(restaurantId: ID!): Restaurant
  updateRestaurant(restaurantId : ID!, createRestaurantInput: CreateRestaurant): Restaurant
}`;