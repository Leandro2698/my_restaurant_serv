import Restaurant from './models/Restaurant'
import User from './models/User'
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { config } from 'dotenv';
import { format } from 'date-fns';
import { Restaurant as TypeRestaurant } from './types';
const mongoUri:string | undefined = config().parsed?.MONGO_URI

async function fixtures(){
  const date = new Date()
  const years = ["2019","2020","2021","2022"];
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
    for(let i = 0 ; i < 3; i += 1) {
    
      const restaurant:TypeRestaurant =  {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'restaurant'+i,
      admin: user._id,
      products: [], 
      turnoversRestaurantYear: []
    }

    for(let i = 0 ; i < 3; i += 1) {
      const price = 10;      
      const product:any = {
        name: 'product'+i,
        unitSalePrice: price,
        turnoversProductMonth:[],
        turnoversProductYear:[],
        category: 'none',
        status: 'draft',
      }
      for(let i = 0 ; i < 30 ; i += 1) {
        for(let u:any = 0 ; u < years.length; u += 1) {
          const fakeTurnoversProductMonth = {
            income: faker.finance.account(4),
            month: faker.date.month(),
            year: years[u],
            day: i, 
            sales: faker.finance.account(3),
          }
          product.turnoversProductMonth.push(fakeTurnoversProductMonth)
        }
      }
      for(let i:any = 0 ; i < years.length; i += 1) {
        const fakeTurnoversProductYear = {
          createdAt:  years[i],
          turnoverYear: faker.finance.account(6),
          totalSales: faker.finance.account(3),
        }
        product.turnoversProductYear.push(fakeTurnoversProductYear)
      }
      restaurant.products.push(product) 
    }
    
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