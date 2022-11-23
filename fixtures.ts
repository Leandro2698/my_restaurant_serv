import Restaurant from './models/Restaurant'
import User from './models/User'
import bcrypt from 'bcrypt';

import mongoose from "mongoose";
import { config } from 'dotenv';
import { format } from 'date-fns';
const mongoUri:string | undefined = config().parsed?.MONGO_URI

async function fixtures(){
  const date = new Date()
  await Restaurant.deleteMany()
  await User.deleteMany()
  const users:any =[
          {
            _id: new mongoose.Types.ObjectId() ,
            firstname: "leni" ,
            lastname: "leni",
            email: "leni@gmail.com",
            password:  await bcrypt.hash('leni', 10),
            restaurants: []
          },
          {
            _id: new mongoose.Types.ObjectId() ,
            firstname: "lou" ,
            lastname: "lou",
            email: "lou@gmail.com",
            password:  await bcrypt.hash('lou', 10),
            restaurants: []
          },
      ]  
  for(const user of users){

    const restaurants: any = [];
    const products: any[] = [];

    for(let i =0 ; i < 3; i += 1) {
    
      const restaurant =  {
        _id: new mongoose.Types.ObjectId() ,
      name: 'restaurant'+i,
      admin: user._id,
      products: [],
      turnoversRestaurantYearts: []
    }
    const product:any = {
      name: 'product'+i,
        unitSalePrice: 10,
        turnoversProductYear:[{
          createdAt: format(date, 'yyyy'),
          turnoverYear: 0,
          totalSales: 0,
        }],
        turnoversProductMonth:[{
          income: 0,
          month: format(date, 'MMMM'),
          year: format(date, 'yyyy'),
          day: format(date, 'd'), 
          sales: 0,
        }],
        category: 'none',
        status: 'draft',
    }
      products.push(product)
      // restaurant.products.push(products)
      restaurants.push(restaurant)
      user.restaurants.push(restaurant._id)
    }
    await Restaurant.insertMany(restaurants)
  } 
  await User.insertMany(users)
  }
 

if(!mongoUri){
throw('error mongo uri')
}
mongoose
  .connect(mongoUri) 
  .then( async () => { 
    await fixtures() 
    process.exit()
  })     