import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum Category {
  Drink = 'drink',
  Food = 'food',
  None = 'none',
  Other = 'other'
}

export type CreateProduct = {
  category: Category;
  name: Scalars['String'];
  unitSalePrice: Scalars['Int'];
};

export type CreateRestaurant = {
  name: Scalars['String'];
};

export type DeleteUser = {
  id: Scalars['ID'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProduct: Restaurant;
  createRestaurant: Restaurant;
  deleteProduct: Restaurant;
  deleteRestaurant?: Maybe<Restaurant>;
  deleteUser: User;
  loginUser: User;
  registerUser: User;
  soldProduct: Restaurant;
  updateProduct: Restaurant;
  updateRestaurant: Restaurant;
  updateUser: User;
};


export type MutationCreateProductArgs = {
  createProductInput: CreateProduct;
  restaurantId: Scalars['ID'];
};


export type MutationCreateRestaurantArgs = {
  createRestaurantInput: CreateRestaurant;
};


export type MutationDeleteProductArgs = {
  productId: Scalars['ID'];
  restaurantId: Scalars['ID'];
};


export type MutationDeleteRestaurantArgs = {
  restaurantId: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  deleteUserInput: DeleteUser;
};


export type MutationLoginUserArgs = {
  loginInput?: InputMaybe<LoginInput>;
};


export type MutationRegisterUserArgs = {
  registerInput: RegisterInput;
};


export type MutationSoldProductArgs = {
  productId: Scalars['ID'];
  restaurantId: Scalars['ID'];
  soldProductInput: SoldProduct;
};


export type MutationUpdateProductArgs = {
  productId: Scalars['ID'];
  restaurantId: Scalars['ID'];
  updateProductInput: UpdateProduct;
};


export type MutationUpdateRestaurantArgs = {
  createRestaurantInput: CreateRestaurant;
  restaurantId: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUser;
  userId: Scalars['ID'];
};

export type Product = {
  __typename?: 'Product';
  category?: Maybe<Scalars['String']>;
  delivery?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  omSite?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  stock?: Maybe<Scalars['Int']>;
  turnoversProductMonth: Array<TurnoversProductMonth>;
  turnoversProductYear: Array<TurnoversProductYear>;
  unitSalePrice: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getProduct: Product;
  getProducts: Array<Product>;
  getRestaurant: Restaurant;
  getRestaurants: Array<Restaurant>;
  getUser: User;
  getUsers: Array<User>;
};


export type QueryGetProductArgs = {
  productId: Scalars['ID'];
  restaurantId: Scalars['ID'];
};


export type QueryGetProductsArgs = {
  restaurantId: Scalars['ID'];
};


export type QueryGetRestaurantArgs = {
  restaurantId: Scalars['ID'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID'];
};

export type RegisterInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  _id: Scalars['ID'];
  admin: User;
  name: Scalars['String'];
  products: Array<Product>;
  turnoversRestaurantYear: Array<TurnoversRestaurantYear>;
};

export enum Status {
  Draft = 'draft',
  Published = 'published'
}

export type SoldProduct = {
  unitProductSold: Scalars['Int'];
};

export type TurnoversProductMonth = {
  __typename?: 'TurnoversProductMonth';
  day: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  income: Scalars['Int'];
  month: Scalars['String'];
  sales: Scalars['Int'];
  year: Scalars['String'];
};

export type TurnoversProductYear = {
  __typename?: 'TurnoversProductYear';
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  totalSales: Scalars['Int'];
  turnoverYear: Scalars['Int'];
};

export type TurnoversRestaurantYear = {
  __typename?: 'TurnoversRestaurantYear';
  createdAt: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  totalSales: Scalars['Int'];
  turnoverYear: Scalars['Int'];
};

export type UpdateProduct = {
  category: Category;
  name: Scalars['String'];
  status: Status;
};

export type UpdateUser = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  restaurants: Array<Scalars['ID']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstname: Scalars['String'];
  id: Scalars['ID'];
  lastname: Scalars['String'];
  password: Scalars['String'];
  restaurants: Array<Maybe<Restaurant>>;
  token?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CATEGORY: Category;
  CreateProduct: CreateProduct;
  CreateRestaurant: CreateRestaurant;
  DeleteUser: DeleteUser;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Product: ResolverTypeWrapper<Product>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  Restaurant: ResolverTypeWrapper<Restaurant>;
  STATUS: Status;
  SoldProduct: SoldProduct;
  String: ResolverTypeWrapper<Scalars['String']>;
  TurnoversProductMonth: ResolverTypeWrapper<TurnoversProductMonth>;
  TurnoversProductYear: ResolverTypeWrapper<TurnoversProductYear>;
  TurnoversRestaurantYear: ResolverTypeWrapper<TurnoversRestaurantYear>;
  UpdateProduct: UpdateProduct;
  UpdateUser: UpdateUser;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateProduct: CreateProduct;
  CreateRestaurant: CreateRestaurant;
  DeleteUser: DeleteUser;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LoginInput: LoginInput;
  Mutation: {};
  Product: Product;
  Query: {};
  RegisterInput: RegisterInput;
  Restaurant: Restaurant;
  SoldProduct: SoldProduct;
  String: Scalars['String'];
  TurnoversProductMonth: TurnoversProductMonth;
  TurnoversProductYear: TurnoversProductYear;
  TurnoversRestaurantYear: TurnoversRestaurantYear;
  UpdateProduct: UpdateProduct;
  UpdateUser: UpdateUser;
  User: User;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProduct?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'createProductInput' | 'restaurantId'>>;
  createRestaurant?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationCreateRestaurantArgs, 'createRestaurantInput'>>;
  deleteProduct?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'productId' | 'restaurantId'>>;
  deleteRestaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType, RequireFields<MutationDeleteRestaurantArgs, 'restaurantId'>>;
  deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'deleteUserInput'>>;
  loginUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationLoginUserArgs>>;
  registerUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'registerInput'>>;
  soldProduct?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationSoldProductArgs, 'productId' | 'restaurantId' | 'soldProductInput'>>;
  updateProduct?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'productId' | 'restaurantId' | 'updateProductInput'>>;
  updateRestaurant?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<MutationUpdateRestaurantArgs, 'createRestaurantInput' | 'restaurantId'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'updateUserInput' | 'userId'>>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  omSite?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  turnoversProductMonth?: Resolver<Array<ResolversTypes['TurnoversProductMonth']>, ParentType, ContextType>;
  turnoversProductYear?: Resolver<Array<ResolversTypes['TurnoversProductYear']>, ParentType, ContextType>;
  unitSalePrice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<QueryGetProductArgs, 'productId' | 'restaurantId'>>;
  getProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryGetProductsArgs, 'restaurantId'>>;
  getRestaurant?: Resolver<ResolversTypes['Restaurant'], ParentType, ContextType, RequireFields<QueryGetRestaurantArgs, 'restaurantId'>>;
  getRestaurants?: Resolver<Array<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryGetUserArgs, 'userId'>>;
  getUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RestaurantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Restaurant'] = ResolversParentTypes['Restaurant']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  admin?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  turnoversRestaurantYear?: Resolver<Array<ResolversTypes['TurnoversRestaurantYear']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnoversProductMonthResolvers<ContextType = any, ParentType extends ResolversParentTypes['TurnoversProductMonth'] = ResolversParentTypes['TurnoversProductMonth']> = {
  day?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  income?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sales?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnoversProductYearResolvers<ContextType = any, ParentType extends ResolversParentTypes['TurnoversProductYear'] = ResolversParentTypes['TurnoversProductYear']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  totalSales?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  turnoverYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TurnoversRestaurantYearResolvers<ContextType = any, ParentType extends ResolversParentTypes['TurnoversRestaurantYear'] = ResolversParentTypes['TurnoversRestaurantYear']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  totalSales?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  turnoverYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  restaurants?: Resolver<Array<Maybe<ResolversTypes['Restaurant']>>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Restaurant?: RestaurantResolvers<ContextType>;
  TurnoversProductMonth?: TurnoversProductMonthResolvers<ContextType>;
  TurnoversProductYear?: TurnoversProductYearResolvers<ContextType>;
  TurnoversRestaurantYear?: TurnoversRestaurantYearResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

