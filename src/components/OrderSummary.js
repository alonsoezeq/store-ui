import React, { useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, TableFooter, Typography } from '@material-ui/core';
import { AppContext } from '../AppContext';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  

const OrderSummary = ({paymentInfo}) => {
    const classes = useStyles();
    const [ context, setContext ] = useContext(AppContext);
    let total = 0;
    let costoEnvio = 0;

    context.cartitems?.forEach(({product, quantity}) => {
      total += product?.price * quantity;
      if(paymentInfo?.pickupPlace === 'home'){
        costoEnvio = paymentInfo?.shippingPrice;
      }
      total += costoEnvio;
    });

    return ( 
      <Paper component={'div'}>
        <TableContainer >
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Precio unitario</TableCell>
                  {
                    paymentInfo?.pickupPlace === 'home' && <TableCell align="right">Costo de envío</TableCell>
                  }
                </TableRow>
                </TableHead>
                <TableBody>
                {
                  context.cartitems?.map(({quantity, product}) => (
                    <TableRow key={product.id}>
                      <TableCell component="th" scope="row">{product.title}</TableCell>
                      <TableCell align="right">
                        <Typography>{quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">$ {product.price}</TableCell>
                      {
                        paymentInfo?.pickupPlace === 'home' && <TableCell align="right">${costoEnvio}</TableCell>
                      }
                    </TableRow>
                  ))
                }
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell align="right" colSpan={paymentInfo?.pickupPlace === 'home'? 4 : 3}>
                      <Typography component={'div'}>
                        <Box display="inline" fontWeight="fontWeightBold" m={1}>Total: $</Box>
                        { total }
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
      </Paper>
     );
}
 
export default OrderSummary;