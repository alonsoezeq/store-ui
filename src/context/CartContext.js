import React, { createContext, useEffect, useState } from 'react';
import config from '../config/config';
import { authHeader } from '../helpers/AuthUtils';

export const CartContext = createContext();

const CartProvider = (props) => {
    
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const getCart = async () => {
            try {
                const res = await fetch(`${config.baseApi}/cart`, {
                    headers: {
                      ...authHeader()
                    }
                });
                const data = await res.json();
                setCart(data);

            } catch(err) {
                console.error(err.status, err.statusText);
            }
        }

        getCart();
    }, []);

    return(
        <CartContext.Provider
        value={{
            cart,
        }}>
            {props.children}   
        </CartContext.Provider>
    )
    
}
 
export default CartProvider;