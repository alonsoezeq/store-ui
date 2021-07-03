import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Typography } from '@material-ui/core';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
});
  

const OrdersList = ({orders}) => {
    const classes = useStyles();
    
    return ( 
        <Paper component={'div'}>
        <TableContainer >
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align="right">Estado de pago</TableCell>
                  <TableCell align="right">Estado de entrega</TableCell>
                  <TableCell align="right">Precio total</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {
                  orders.length > 0 && orders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell component="th" scope="row">{order.id}</TableCell>
                      <TableCell align="right">
                        <Typography>{order.paymentStatus}</Typography>
                      </TableCell>
                      <TableCell align="right">{order.shippingStatus}</TableCell>
                      <TableCell align="right">{order.totalPrice}</TableCell>
                    </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            </TableContainer>
      </Paper>
     );
}
 
export default OrdersList;