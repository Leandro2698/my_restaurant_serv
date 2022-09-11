const User = require('../../models/User') ;
const { UserInputError } = require('apollo-server-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Restaurant = require('../../models/Restaurant');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
dotenv.config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '2h' }
  );
}

module.exports = {
  Query: {
    async getUser(_, {userId: id }) {
      try {
        const user = await User.findById(id).populate(['restaurants'])
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUsers(_, {}){
      const users = await User.find({}).populate(['restaurants']);
      console.log(`userusers`,users)
      return users;
    },
  },
  Mutation: {
    async registerUser(_, { registerInput: { firstname,lastname,email,password, confirmPassword } }) {

      // Validate user data
      const {valid, errors} = validateRegisterInput(firstname,lastname,email,password, confirmPassword)

      if(!valid){
        throw new UserInputError('Errors', { errors });
      }

      // See if an old user exists with email attempting to register 
      const oldUser = await User.findOne({email});

      // Throw error if that user exists
      if(oldUser) {
        throw new UserInputError(`A user is already register with the email ${email}`, 'USER_ALREADY_EXISTS');
      }

      // Emcrypt password 
        const encryptedPassword = await bcrypt.hash(password,10);

      // Build out mongoose model
      const newUser = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        create_at: new Date().toLocaleDateString(),
        password: encryptedPassword,

      })

      
      // Save our user in MongoDB
      const res = await newUser.save();
      
      // Create our JWT(attatch to our User model)
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    
    },


    async loginUser(_, { loginInput: { email,password } }) {

       // Validate user data
       const {valid, errors} = validateLoginInput(email,password)

       if (!valid) {
         throw new UserInputError('Errors', { errors });
        }
      
      // See if the user exists with the email
      const user = await User.findOne({email});

      if(!user){
        errors.general = 'User not found'
        throw new UserInputError('User not found', 
        { errors })
      }
      // Check if the entered password equals the encrypted password 
      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },


    async updateUser(_, { userId:  id  , updateUserInput: { firstname, lastname, email, restaurants } }){
      console.log(`userId`,id)
      try {
        const updateUser = await User.findByIdAndUpdate(
          id,
          {
            firstname: firstname,
            lastname: lastname,
            email: email.toLowerCase(), 
            restaurants: restaurants
          },
          { new: true}
        );
        let restaurantAdmin = await Restaurant.findById(updateUser.restaurants);

        restaurantAdmin.admin.push(updateUser._id);
        restaurantAdmin.save();
        return updateUser.populate(['restaurants']);
      } catch (err) {
        console.log(err);
      }
    },

    async deleteUser(_, { deleteUserInput: { id } }) {
      try {
        const user = await User.findByIdAndRemove(id)
        return user;
      } catch (err) {
        console.log(err);
      }
    },
    
  },
};
