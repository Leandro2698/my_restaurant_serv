import { format } from 'date-fns';
import { Restaurant, TurnoversProductYear, TurnoversRestaurantYear } from '../types';
/**
 * Make the calcul turnover for all products
 * @param {[Object]} restaurant object Restaurant
 * @returns the result of the turnover of each products.
 */

// TODO explain all var and functions

export default (restaurant:Restaurant) => {
  const thisYear = new Date();

  const foundTurnover = restaurant.turnoversRestaurantYear.some((e:TurnoversRestaurantYear) => e.createdAt === format(thisYear, 'yyyy'));

  const turnoverRestaurant = restaurant.turnoversRestaurantYear.find((e:TurnoversRestaurantYear) => e.createdAt === format(thisYear, 'yyyy'));

  const allTurnoverForThisYear = [];
  const allSalesForThisYear = [];

  for (let i = 0; i < restaurant.products.length; i += 1) {
    const { turnoversProductYear } = restaurant.products[i];
    // const { turnoversProductMonth } = restaurant.products[i];

    const turnoverProductThisYear = turnoversProductYear.filter((e:TurnoversProductYear) => e.createdAt === format(thisYear, 'yyyy'));
    if (turnoverProductThisYear.length > 0) {
      const { turnoverYear, totalSales } = turnoverProductThisYear[0];
      allTurnoverForThisYear.push(turnoverYear);
      allSalesForThisYear.push(totalSales);
    }
  }
  // Calcul total turnover this year Restaurant
  const resultTurnoverYearRestaurant = allTurnoverForThisYear.reduce((accumulator, value) => accumulator + value, 0);
  // Calcul total sales this year Restaurant
  const resultSalesYearRestaurant = allSalesForThisYear.reduce((accumulator, value) => accumulator + value, 0);
  if (foundTurnover && turnoverRestaurant) {
    turnoverRestaurant.turnoverYear = resultTurnoverYearRestaurant;
    turnoverRestaurant.totalSales = resultSalesYearRestaurant;
  } else {
    restaurant.turnoversRestaurantYear.unshift({
      createdAt: format(thisYear, 'yyyy'),
      totalSales: resultSalesYearRestaurant,
      turnoverYear: resultTurnoverYearRestaurant,
    });
  }
  return restaurant;
};
