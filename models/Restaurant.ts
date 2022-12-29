import { model, Schema } from 'mongoose';
import { Restaurant } from '../types';

const restaurantSchema = new Schema<Restaurant>(
  {
    name: { 
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        name: String,
        unitSalePrice: Number,
        turnoversProductYear: [
          {
            createdAt: String,
            turnoverYear: Number, 
            totalSales: Number,
          },
        ],
        turnoversProductMonth: [
          {
            income: Number,
            month: String,
            year: String,
            sales: Number,
            day: String,
          },
        ],
        category: {
          type: String,
          enum: ['none', 'drink', 'food', 'other'],
        },
        status: {
          type: String,
          enum: ['draft', 'published'],
        },
      },
    ],
    turnoversRestaurantYear: [
      {
        createdAt: String,
        totalSales: Number,
        turnoverYear: Number,
      },
    ],
  },
);

const Restaurant = model<Restaurant>('Restaurant', restaurantSchema);
export default Restaurant;