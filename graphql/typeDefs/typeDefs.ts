import { mergeTypeDefs } from '@graphql-tools/merge';
import {readFileSync} from 'fs' 
const schemas = readFileSync('./graphql/typeDefs/schemas.graphql').toString()

export default mergeTypeDefs([schemas]); 