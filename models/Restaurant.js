const { model, Schema } = require('mongoose');

const restaurantSchema = new Schema(
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
        createdAt: Date,
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
        stock: Number,
        category: {
          type: String,
          enum: ['none', 'drink', 'food', 'other'],
        },
        status: {
          type: String,
          enum: ['draft', 'published'],
        },
        delivery: Number,
        onSite: Number,
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

module.exports = model('Restaurant', restaurantSchema);
