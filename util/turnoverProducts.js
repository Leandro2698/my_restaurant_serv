/**
 * Make the calcul turnover for all products
 * @param {[Object]} restaurant object Restaurant
 * @returns the result of the turnover of each products.
 */
module.exports = (restaurant) => {
  if (restaurant) {
    const listProduct = [];

    for (let i = 0; i < restaurant.products.length; i += 1) {
      const objProduct = { id: restaurant.products[i].id, turnoverProduct: restaurant.products[i].unitProductSold * restaurant.products[i].unitSalePrice };
      listProduct.push(objProduct);
    }

    for (let i = 0; i < listProduct.length; i += 1) {
      const productIndex = restaurant.products.findIndex((product) => product.id === listProduct[i].id);
      const myProduct = Object.values(restaurant.products)[productIndex];
      myProduct.turnoverProduct = listProduct[i].turnoverProduct;
    }
    return restaurant;
  }
  throw new Error('Restaurant not found for turnover of all products');
};
