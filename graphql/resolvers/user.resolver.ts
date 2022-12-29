import { UserInputError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/User';
import Restaurant from '../../models/Restaurant';
import { validateRegisterInput, validateLoginInput } from '../../util/validators/validatorUser';
import { Resolvers, User as UserType } from '../../types';

dotenv.config();

function generateToken(user:UserType) {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      // restaurants: user.restaurants,
    }, 
    `${process.env.JWT_SECRET}`,
    { expiresIn: '2h' },
  );
}

export const userResolver : Resolvers = {
  Query: {
    async getUser(_, { userId: id }) {
        const user = await User.findById(id).populate(['restaurants']);
        if (user) {
          return user;
        }
        throw new Error('User not found');
    },
    async getUsers() {
      const users = await User.find({}).populate(['restaurants']);
      return users;
    },
  },
  Mutation: {
    async registerUser(_, {
      registerInput: {
        firstname, lastname, email, password, confirmPassword
      },
    }) {
      // Validate user data

      const { valid, errors } = validateRegisterInput(firstname, lastname, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
 
      // See if an old user exists with email attempting to register
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('Email is taken', { 
          errors: {
            email: 'This email is taken'
          }
        });
      }

      // Emcrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Build out mongoose model
      const newUser = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: encryptedPassword,
        restaurants: []

      });

      // Save our user in MongoDB
      const res:any = await newUser.save();
      // Create our JWT(attatch to our User model)
      const token = generateToken(res);

      console.log('register user',res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async loginUser(_, { loginInput: { email, password } }:any) {
      // Validate user data
      const { valid, errors } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // See if the user exists with the email
      const user:any  = await User.findOne({ email }).populate(['restaurants']);

      if (!user) {
        throw new UserInputError(
          'User not found',
          { errors },
        );
      }
      // Check if the entered password equals the encrypted password
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);
      console.log('login user', user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async updateUser(_, {
      userId: id, updateUserInput: {
        firstname, lastname, email, restaurants,
      },
    }) {
        const updateUser  = await User.findByIdAndUpdate(
          id,
          {
            firstname,
            lastname,
            email: email.toLowerCase(),
            restaurants,
          },
          { new: true },
        );
        const restaurantAdmin:any  = await Restaurant.findById(updateUser?.restaurants);
        if(updateUser){
          restaurantAdmin?.admin.push(updateUser._id);

          restaurantAdmin?.save();
          return updateUser.populate(['restaurants']);
        }
        throw new UserInputError('User not found');
      
    },

    async deleteUser(_, { deleteUserInput: { id } }) {
        const user  = await User.findByIdAndRemove(id);
        if(user){
          const userRestaurant = user.restaurants;
          for (let i = 0; i < userRestaurant.length; i++) {
            await Restaurant.findByIdAndRemove(userRestaurant[i]);
          }
          return user;
        }
        throw new UserInputError('User not found');
      }
  },
};
