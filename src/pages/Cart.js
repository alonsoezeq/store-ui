import { Button, Container, Grid, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import CartList from '../components/CartList';
import config from "../config/config";
import { authHeader } from '../helpers/AuthUtils';

const Cart = () => {
  const [ context, setContext ] = useContext(AppContext);
  const [ items, setItems ] = useState([]);
  const { loading } = context;

  useEffect(() => {
    setContext({ ...context, caritems: [],loading: true });

    fetch(`${config.baseApi}/cart`, {
      headers: {
        ...authHeader()
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setItems(data);
      setContext({ ...context, cartitems: data, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, []);

  return ( 
    <>
      {       
        !loading && items.length > 0 &&
        <Container>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <CartList />
            </Grid>
            <Grid container item justify="flex-end">
              <Button variant="contained" color="primary">Comprar</Button>          
            </Grid>                  
          </Grid>
        </Container>
      }
      {
        !loading && items.length === 0 &&
        <Typography>No tiene productos en el carrito</Typography>
      }
    </>
  );
}
 
export default Cart;