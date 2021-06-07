import { Button, Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CartList from '../components/CartList';


const URL = 'http://localhost:3000/api/v1'

const Cart = () => {
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        //Recupero los elementos del localStorage
        let cart = JSON.parse(localStorage.getItem("cart"));
        let list;

        if(cart){
            //Busco los productos
            Promise.all(cart.map(cartProduct => {
                return fetch(URL + '/products/' + cartProduct.id)
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(item => {
                    item.amount = cartProduct.amount
                    return item;
                })        
                .catch(err => console.log(err));
            }))
            .then(productList => {
                list = [];
        
                //Guardo en el array
                productList.forEach(product => {
                    let index = cartList.findIndex(item => item.id === product.id);
                    
                    if(index > -1) {
                        //Actualizo el la cantidad, si ya está en el carrito
                        list = [...cartList];
                        list[index].amount = product.amount;
                    } else {
                        list.push(product);
                    }
                });

                setCartList(list);
            });
        } else {
            console.log("No hay productos en el carrito");
        }    
    },[]);

    return ( 
        <>
        {       
            cartList?.length > 0 ? 
                <Container>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <CartList cartList={cartList} setCartList={setCartList} />
                        </Grid>
                        <Grid container item justify="flex-end">
                            <Button variant="contained" color="primary">Comprar</Button>          
                        </Grid>                  
                    </Grid>
                </Container> :
                <Typography>No tiene productos en el carrito</Typography>
        }
        </>
    );
}
 
export default Cart;