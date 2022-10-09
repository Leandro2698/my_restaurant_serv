const { model, Schema } = require('mongoose');

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    employees: [
      {
        firstname: String,
        lastname: String,
        role: String,
        salary: Number,
        admin: String,
      },
    ],
    sales: [
      {
        productId: String,
        createdAt: Number,
        unitProductSold: Number,

      },
    ],
    products: [
      {
        name: String,
        createdAt: Number,
        // unitProductSold: Number,
        unitSalePrice: Number,
        turnoverProduct: Number,
        turnoversProduct: [
          {
            createdAt: Number,
            turnoverYear: Number,
          },
        ],
        stock: Number,
        category: {
          type: String,
          enum: ['drink', 'food', 'other'],
        },
        status: {
          type: String,
          enum: ['new', 'draft', 'done'],
        },
        delivery: Number,
        onSite: Number,
      },
    ],
    turnoversRestaurant: [
      {
        createdAt: Number,
        turnoverYear: Number,
      },
    ],
  },
);

module.exports = model('Restaurant', restaurantSchema);
