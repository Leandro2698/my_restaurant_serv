import { mergeTypeDefs } from '@graphql-tools/merge';
// import userTypeDefs from './user';
// import restaurantTypeDefs from './restaurant';
// import productTypeDefs from './product';
import {readFileSync} from 'fs' 
const schemas = readFileSync('./graphql/typeDefs/schemas.graphql').toString()

export default mergeTypeDefs([schemas]);