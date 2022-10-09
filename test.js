const { faker } = require('@faker-js/faker');

const sales = [
  {
    id: faker.datatype.uuid(),
    productId: '1',
    unitProductSold: 0,
    createdAt: new Date(),

  },
  {
    id: faker.datatype.uuid(),
    productId: '1',
    createdAt: new Date(2021, 2),

  },
  {
    id: faker.datatype.uuid(),
    productId: '3',
    createdAt: new Date(2021, 2),

  },
  {
    id: faker.datatype.uuid(),
    productId: '2',
    createdAt: new Date(2021, 2),

  },
  {
    id: faker.datatype.uuid(),
    productId: '4',
    createdAt: new Date(2021, 1),

  },
  {
    id: faker.datatype.uuid(),
    productId: '1',
    createdAt: new Date(),

  },
  {
    id: faker.datatype.uuid(),
    productId: '4',
    createdAt: new Date(),

  },
];

// exemple for product model
const products = [
  {
    id: '1',
    createdAt: new Date(),
    price: 20,
    turnoversProduct: [
      {
        id: '1',
        createdAt: new Date().getFullYear(),
        turnoverYear: 26002,
        turnoverMonth: [
          {
            month: null,
            total: 0,
          },
        ],
      },
      {
        id: '2',
        createdAt: new Date(2021, 1),
        turnoverYear: 36002,
        turnoverMonth: [
          {
            month: null,
            total: 0,
          },
        ],
      },
      {
        id: '3',
        createdAt: new Date(),
        turnoverYear: 0,
        turnoverMonth: [
          {
            month: null,
            total: 0,
          },
        ],
      },
    ],
  },
];

module.exports = () => {
  // count turnover of each product
  // filter by date
  // make object of all turnover by date like turnover 2022 etc

  const indexProduct = '1';
  const productSoldYear = [
  ];
  const productSoldMonth = [
  ];
  const thisYear = new Date();
  // console.log('thisthisYear', thisYear);
  // verify if turnoversProduct exist ?
  // console.log('prodproducts.turnoversProduct', products[0].turnoversProduct.map((e) => e));
  for (let i = 0; i < sales.length; i += 1) {
    if (sales[i].productId === indexProduct) {
      if (sales[i].createdAt.getFullYear() === thisYear.getFullYear()) {
        productSoldYear.push({
          productId: sales[i].productId,
          soldAt: sales[i].createdAt,
        });
      }
      if (sales[i].createdAt.getFullYear() === thisYear.getFullYear()) {
        productSoldMonth.push({
          productId: sales[i].productId,
          soldAt: sales[i].createdAt.getMonth(),
        });
      }
    }
  }
  for (let i = 0; i < products[0].turnoversProduct.length; i += 1) {
    // year
    if (products[0].turnoversProduct[i].createdAt === thisYear.getFullYear()) {
      // console.log('monthTest', products[0].turnoversProduct[i].createdAt.getMonth());
      console.log('product change', products[0].turnoversProduct[i].turnoverYear = productSoldYear.length * products[0].price);
    }
    // month
    // week
  }
  console.log('productSoldYear', productSoldYear);
  console.log('productSoldMonth', productSoldMonth);
  console.log('product save', products[0].turnoversProduct[2]);
};
