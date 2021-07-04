import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container, fade, FormControl, Grid, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { isBuyer } from '../helpers/AuthUtils';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';


const useStyles = makeStyles((theme) => ({
    select: {
      width: "11.5vw",
    },
    table: {
      minWidth: 650,
    },
    search: {
      marginBottom: '2vw',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'black',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));
  

const OrdersList = ({orders, setOrders}) => {
    const classes = useStyles();
    const [filter, setFilter] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([...orders]);

    const handleFilter = (e) => {
      setFilter(e.target.value);
    }

    useEffect(() => {
      let auxOrders
      if(filter === '') {
        auxOrders = orders;
      } else {
        auxOrders = orders.filter( order => order.userId.toString() === filter);
      }
      console.log(auxOrders);
      setFilteredOrders(auxOrders);
    }, [filter]);

    const handleChange = (value, order) => {
      let index = orders.indexOf(order);
      let auxArray = orders.slice();

      if (index !== -1) {
          order.shippingStatus = value;
          auxArray[index] = order;
      }

      setOrders(auxArray);      
    }
 
    return ( 
      <Grid container spacing={2}>
        {
          !(isBuyer()) && 
          <Grid item xs={12}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Id cliente..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleFilter}
              />
            </div>
          </Grid>
        }
        { filteredOrders.length > 0 &&     
        <Grid item xs={12}>
          <Paper component={'div'}>    
            <TableContainer >
                  <Table className={classes.table} aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                      <TableCell align="center">Id Transacción</TableCell>
                      {
                        !(isBuyer()) && <TableCell align="center">Id Cliente</TableCell>
                      }
                      <TableCell align="center">Estado de pago</TableCell>
                      <TableCell align="center">Estado de entrega</TableCell>
                      <TableCell align="center">Precio total</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                      filteredOrders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell align="center" >{order.id}</TableCell>
                          {
                            !(isBuyer()) && <TableCell align="center">{order.userId}</TableCell>
                          }
                          <TableCell align="center">
                            <Typography>{order.paymentStatus}</Typography>
                          </TableCell>
                          {
                            isBuyer() ?
                            <TableCell align="center">{order.shippingStatus}</TableCell> :
                            
                            <TableCell size={"medium"} align="center">
                              <FormControl>
                                <Select
                                  labelId="shipping-status"
                                  id="shipping-status"
                                  value={order.shippingStatus}
                                  onChange={(e) => {handleChange(e.target.value, order)}}
                                  className={classes.select}
                                >
                                  <MenuItem value={"pending"}>Pago pendiente</MenuItem>
                                  <MenuItem value={"paid"}>Pagado</MenuItem>
                                  <MenuItem value={"deliveryPending"}>Entrega pendiente</MenuItem>
                                  <MenuItem value={"pickupPending"}>Retiro pendiente</MenuItem>
                                  <MenuItem value={"delivered"}>Entregado</MenuItem>
                                  <MenuItem value={"pickedup"}>Retirado</MenuItem>
                                  <MenuItem value={"cancelled"}>Cancelado</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                          }
                          <TableCell align="right">$ {order.totalPrice}</TableCell>
                        </TableRow>
                      ))
                    }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            }
            {
              filteredOrders.length === 0 && 
              <Grid item xs={12}> 
                <Typography align="center">No se encontraron resultados</Typography>
              </Grid>
            }
      </ Grid>
     );
     
}
 
export default OrdersList;