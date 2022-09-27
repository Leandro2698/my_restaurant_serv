/**
 * Make the calcul turnover for the restaurant
 * @param {[Object]} restaurant object Restaurant
 * @returns the result of the turnover of each reactaurant.
 */
module.exports = (restaurant) => {
  if (restaurant) {
    const listTurnover = [];

    for (let i = 0; i < restaurant.turnoversYears.length; i += 1) {
      const objProduct = { id: restaurant.turnoversYears[i].id, turnoversYears: restaurant.turnoversYears[i].total };
      listTurnover.push(objProduct);
    }
    for (let i = 0; i < listTurnover.length; i += 1) {
      const turnoverIndex = restaurant.turnoversYears.findIndex((turnover) => turnover.id === listTurnover[i].id);
      const turnover = Object.values(restaurant.turnoversYears)[turnoverIndex];
      const turnoverProductTotal = restaurant.products.map((e) => (e.year === turnover.year ? e.turnoverProduct : 0));
      const turnoverTotalYear = turnoverProductTotal.reduce((accumulator, value) => accumulator + value, 0);
      turnover.total = turnoverTotalYear;
    }
    return restaurant;
  }
  throw new Error('Restaurant not found for turnover by year');
};
