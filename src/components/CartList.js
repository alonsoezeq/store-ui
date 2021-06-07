import React from 'react';
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const CartList = ({cartList, setCartList}) => {
  const classes = useStyles();

  let total = 0;
  cartList.filter(item => total += item.price * item.amount);

  const deleteProduct = (id) => {
    let cart = cartList.filter(item => item.id !== id);
    localStorage.setItem("cart", cart);
    setCartList(cart);
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
        {cartList?.map((product) => (
          <TableRow key={product.id}>
            <TableCell component="th" scope="row">{product.title}</TableCell>
            <TableCell align="right">{product.amount}</TableCell>
            <TableCell align="right">{product.price}</TableCell>
            <TableCell align="right"><Button onClick={() => deleteProduct(product.id)}><Delete /></Button></TableCell>
          </TableRow>
        ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell align="right" colSpan={3}>
              <Typography>
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