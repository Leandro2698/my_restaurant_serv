const { format } = require('date-fns');
/**
 * Make the calcul turnover for all products
 * @param {[Object]} restaurant object Restaurant
 * @returns the result of the turnover of each products.
 */

module.exports = (restaurant, productId) => {
  const thisYear = new Date();

  const sale = restaurant.sales.find((e) => format(e.createdAt, 'yyyy') === format(thisYear, 'yyyy') && e.productId === productId);

  const product = restaurant.products.find((e) => e.id === productId);

  const turnoverProduct = product.turnoversProduct;

  const foundTurnover = product.turnoversProduct.some((e) => format(e.createdAt, 'yyyy') === format(thisYear, 'yyyy'));

  if (foundTurnover) {
    for (let i = 0; i < turnoverProduct.length; i += 1) {
      const turnoverYear = sale.unitProductSold * product.unitSalePrice;
      turnoverProduct[i].turnoverYear = turnoverYear;
    }
  } else {
    turnoverProduct.unshift({
      createdAt: new Date(),
      turnoverYear: sale.unitProductSold * product.unitSalePrice,
    });
  }
  return restaurant;
};
