/**
 * Agrega un producto al carrito (localStorage)
 */
export const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  
  let cartProduct = {
    id: product.id,
    amount: 1, //Cambiar para agregar más productos
  }

  if (cart) {
    let indexToUpdate = cart.findIndex(product => product.id === cartProduct.id);

    if (indexToUpdate !== -1) {
      //Si ya fue agegado, solo actualizo la cantidad
      cart[indexToUpdate].amount += cartProduct.amount;
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      cart.push(cartProduct);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } else {
    cart = [];
    cart.push(cartProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
  }    
}
