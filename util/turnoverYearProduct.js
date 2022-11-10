const { format } = require('date-fns');
/**
 * Make the calcul turnover for all products
 * @param {[Object]} restaurant object Restaurant
 * @returns the result of the turnover of each products.
 */

// TODO explain all var and functions

module.exports = (restaurant, product) => {
  const thisYear = new Date();
  const turnoversMonth = product.turnoversProductMonth;
  const allTurnoverMonth = [];
  const allSalesMonth = [];
  for (let i = 0; i < turnoversMonth.length; i += 1) {
    if (turnoversMonth[i].year === format(thisYear, 'yyyy')) {
      allTurnoverMonth.push(turnoversMonth[i].income);
    }
    if (turnoversMonth[i].year === format(thisYear, 'yyyy')) {
      allSalesMonth.push(turnoversMonth[i].sales);
    }
  }
  const resultTurnoverYear = allTurnoverMonth.reduce((accumulator, value) => accumulator + value, 0);
  const resultSalesYear = allSalesMonth.reduce((accumulator, value) => accumulator + value, 0);

  const foundTurnoverYear = product.turnoversProductYear.some((e) => e.createdAt === format(thisYear, 'yyyy'));

  const turnoversProductThisYear = product.turnoversProductYear.find((e) => e.createdAt === format(thisYear, 'yyyy'));

  if (foundTurnoverYear) {
    turnoversProductThisYear.turnoverYear = resultTurnoverYear;
    turnoversProductThisYear.totalSales = resultSalesYear;
  } else {
    product.turnoversProductYear.unshift({
      createdAt: format(thisYear, 'yyyy'),
      turnoverYear: resultTurnoverYear,
      totalSales: resultSalesYear,
    });
  }
  return restaurant;
};
