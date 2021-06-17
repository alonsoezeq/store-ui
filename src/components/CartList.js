import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Button, TableFooter, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { AppContext } from '../AppContext';
import config from '../config/config';
import { authHeader } from '../helpers/AuthUtils';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const CartList = () => {
  const classes = useStyles();
  const [ context, setContext ] = useContext(AppContext);
  const { cartitems, loading } = context;

  let total = 0;
  cartitems.forEach(({quantity, product}) => {
    total += product?.price * quantity
  });

  const handleQuantityChange = (id) => (event) => {
    const item = cartitems.find(({ productId }) => productId === id);
    const newitem = {
      ...item,
      productId: id,
      quantity: event.target.value
    };

    fetch(`${config.baseApi}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(newitem)
    })
    .then((res) => res.ok ? res : Promise.reject(res.statusText))
    .then((data) => {
      const newcart = [
        ...cartitems.filter((item) => item.productId !== id),
        newitem
      ];

      setContext({
        ...context,
        cartitems: newcart,
        status: 'success',
        message: 'Successfully modified'
      });      
    })
    .catch(err => {
      setContext({ ...context, status: 'error', message: err });
    });
  }

  const deleteProduct = (id) => {
    fetch(`${config.baseApi}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader()
      }
    })
    .then(res => res.ok ? res : Promise.reject(res.statusText))
    .then(() => {
      setContext({
        ...context,
        cartitems: cartitems.filter(({ productId }) => productId !== id),
        status: 'success',
        message: 'Successfuly removed from cart'
      })
    })
    .catch(err => {
      setContext({ ...context, status: 'error', message: err });
    });
  }

  return ( 
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
        <TableRow>
          <TableCell>Producto</TableCell>
          <TableCell align="right">Cantidad</TableCell>
          <TableCell align="right">Precio unitario</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {
          !loading &&
          cartitems.map(({quantity, product}) => (
            <TableRow key={product.id}>
              <TableCell component="th" scope="row">{product.title}</TableCell>
              <TableCell align="right">
                <input type="number" min="1" step="1" max={product.quantity} value={quantity} onChange={handleQuantityChange(product.id)} />
              </TableCell>
              <TableCell align="right">{product.price}</TableCell>
              <TableCell align="right"><Button onClick={() => deleteProduct(product.id)}><Delete /></Button></TableCell>
            </TableRow>
          ))
        }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell align="right" colSpan={3}>
              <Typography component={'div'}>
                <Box display="inline" fontWeight="fontWeightBold" m={1}>Total:</Box>
                {total}
              </Typography>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
   );
}
 

export default CartList;