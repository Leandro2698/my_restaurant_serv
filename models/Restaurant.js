const { model, Schema } = require('mongoose');

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    create_at: {
      type: String,
    },
    status: {
      type: String,
      enum: ['new', 'progress', 'completed'],
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
    products: [
      {
        name: String,
        year: String,
        unitProductSold: Number,
        unitSalePrice: Number,
        turnoverProduct: Number,
      },
    ],
    turnoversYears: [
      {
        year: String,
        total: Number,
      },
    ],
  },
);

module.exports = model('Restaurant', restaurantSchema);
