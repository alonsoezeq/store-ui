import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

const CartList = ({cartList, setCartList, setTotal}) => {
    const classes = useStyles();

    const deleteProduct = (id) => {
        let newList = cartList.filter(item => item.id !== id);
        let cart = JSON.parse(localStorage.getItem("cart"));
        let newCart = cart.filter(item => item.id !== id);
        let total = 0;

        localStorage.setItem("cart", JSON.stringify(newCart));
        newList.map(item => total += (item.price * item.amount));

        setTotal(total);

        setCartList(newList);
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
                        <TableCell align="right"><Button onClick={() => deleteProduct(product.id)}>X</Button></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
     );
}
 

export default CartList;