const { format } = require('date-fns');

/**
 * Make the calcul turnover for the restaurant
 * @param {[Object]} restaurant object Restaurant
 * @returns the result of the turnover of each reactaurant.
 */
module.exports = (restaurant) => {
  if (restaurant) {
    const thisYear = new Date();

    const listTurnover = [];

    for (let i = 0; i < restaurant.products.length; i += 1) {
      const { turnoversProduct } = restaurant.products[i];
      const turnoversYearProduct = turnoversProduct.find((e) => format(e.createdAt, 'yyyy') === format(thisYear, 'yyyy'));

      listTurnover.push(turnoversYearProduct.turnoverYear);
    }

    const validTurnoverRestaurant = restaurant.turnoversRestaurant.some((e) => format(e.createdAt, 'yyyy') === format(thisYear, 'yyyy'));

    const turnoverRestaurant = restaurant.turnoversRestaurant.find((e) => format(e.createdAt, 'yyyy') === format(thisYear, 'yyyy'));

    if (!validTurnoverRestaurant) {
      const turnoverYear = listTurnover.reduce((accumulator, value) => accumulator + value, 0);
      restaurant.turnoversRestaurant.unshift({
        turnoverYear,
        createdAt: new Date(),
      });
    } else {
      const turnoverYear = listTurnover.reduce((accumulator, value) => accumulator + value, 0);
      turnoverRestaurant.turnoverYear = turnoverYear;
    }

    return restaurant;
  }
  throw new Error('Restaurant not found for turnover by year');
};
