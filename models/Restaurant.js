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
    admin: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    employees: [
      {
        firstname: String,
        lastname: String,
        role: String,
        salary: String,
        admin: String,
      },
    ],
    products: [
      {
        name: String,
        year: String,
        unit_product_sold: String,
        unit_sale_price: String,
        turnover_product: String,
      },
    ],
    turnovers_years: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Turnover',
        year: String,
        total: String,
      },
    ],
  },
);

module.exports = model('Restaurant', restaurantSchema);
