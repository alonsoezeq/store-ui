import { Button, Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CartList from '../components/CartList';


const URL = 'http://localhost:3000/api/v1'

const Cart = () => {
    const [cartList, setCartList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        //Recupero los elementos del localStorage
        let cart = JSON.parse(localStorage.getItem("cart"));
        let list;
        let precioTotal = 0;

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

                //Calculo el precio total
                list.map(producto => precioTotal += (producto.price * producto.amount));
                setTotal(precioTotal);
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
                    <CartList cartList={cartList} setCartList={setCartList} setTotal={setTotal}/>
                    <Grid container direction="column" alignContent="flex-end" spacing={2}>
                        <Grid item>
                            <Typography>
                                    Total: {total}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary">Comprar</Button>          
                        </Grid>                     
                    </Grid>              
                </Container> :
                <p>No tiene productos en el carrito</p>
        }
        </>
    );
}
 
export default Cart;