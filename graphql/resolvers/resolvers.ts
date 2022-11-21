import { mergeResolvers }  from '@graphql-tools/merge';
import {userResolver}  from './user.resolver';
import { restaurantResolver }  from './restaurant.resolver';
import { productResolver }  from './product.resolver';

export default mergeResolvers([userResolver, restaurantResolver, productResolver]);
 