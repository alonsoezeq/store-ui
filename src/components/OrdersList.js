import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, fade, FormControl, Grid, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { authHeader, isAdmin, isBuyer, isSeller } from '../helpers/AuthUtils';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import config from '../config/config';
import { AppContext } from '../AppContext';
import orderState from "../config/orderStates.json";
import paymentState from '../config/paymentStates.json';

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
    const [ context, setContext ] = useContext(AppContext);
    const [filter, setFilter] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([...orders]);

    useEffect(() => {
      let auxOrders
      if(filter === '') {
        auxOrders = orders;
      } else if(isBuyer()) {
        auxOrders = orders.filter( order => order.id.toString() === filter);
      } else {
        auxOrders = orders.filter( order => order.userId.toString() === filter);
      }
      setFilteredOrders(auxOrders);
    }, [filter, orders]);

    const handleFilter = (e) => {
      setFilter(e.target.value);
    }

    const resetFilter = () => {
      setFilter('');
    }

    const changeState = (id, order) => {
      fetch(`${config.baseApi}/sales/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(order)
      })
      .then((res) => res.ok ? res : Promise.reject(res.statusText))
      .then((data) => {
        setContext({ ...context, status: 'success', message: 'Se modificó el estado' });
      })
      .catch(err => {
        setContext({ ...context, status: 'error', message: "Ocurrio un problema al modificar el estado" });
      });
    }

    const handleStateChange = (value, order) => {
      let index = orders.indexOf(order);
      let auxArray = orders.slice();

      if (index !== -1) {
          order.shippingStatus = value;
          auxArray[index] = order;
      }
      changeState(order.id, order);
      setOrders(auxArray);      
    }

    const parseOrderState = (shippingStatus) => {
      return orderState[shippingStatus];
    };

    const parsePaymentState = (paymentStatus) => {
      return paymentState[paymentStatus];
    };
 
    return ( 
      <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div> 
              <InputBase
                placeholder={isBuyer() ? "Id transacción..." : "Id cliente..."}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleFilter}
                value={filter}
              />
              <Button size="small" style={{marginLeft:'0.5rem'}} variant="contained" color="primary" onClick={resetFilter}>Limpiar</Button>
            </div>
          </Grid>
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
                      <TableCell align="center">Direccion de entrega</TableCell>
                      <TableCell align="center">Precio total</TableCell>
                      <TableCell align="center">Costos de envio</TableCell>
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
                          <TableCell align="center">{parsePaymentState(order.paymentStatus)}</TableCell>
                          {
                            isBuyer() &&
                            <TableCell align="center">{parseOrderState(order.shippingStatus)}</TableCell>

                          }
                          {
                            (isSeller() || isAdmin()) && 
                            <TableCell size={"medium"} align="center">           
                                  {
                                    order.shippingStatus === "deliveryPending" &&
                                    <FormControl>
                                      <Select
                                        labelId="shipping-status"
                                        id="shipping-status"
                                        value={order.shippingStatus}
                                        onChange={(e) => {handleStateChange(e.target.value, order)}}
                                        className={classes.select}
                                      >
                                        <MenuItem value={"deliveryPending"}>Entrega pendiente</MenuItem>
                                        <MenuItem value={"deliveryNotSuccessful"}>No se pudo entregar</MenuItem>
                                        <MenuItem value={"delivered"}>Entregado</MenuItem> 
                                        <MenuItem value={"cancelled"}>Cancelado</MenuItem> 
                                      </Select>
                                    </FormControl>
                                  }
                                  {
                                    order.shippingStatus === "pickupPending" &&
                                    <FormControl>
                                      <Select
                                        labelId="shipping-status"
                                        id="shipping-status"
                                        value={order.shippingStatus}
                                        onChange={(e) => {handleStateChange(e.target.value, order)}}
                                        className={classes.select}
                                      >
                                        <MenuItem value={"pickupPending"}>Retiro pendiente</MenuItem>
                                        <MenuItem value={"pickedup"}>Retirado</MenuItem> 
                                        <MenuItem value={"cancelled"}>Cancelado</MenuItem> 
                                      </Select>
                                    </FormControl>
                                  }
                                  {
                                    (order.shippingStatus === "deliveryNotSuccessful" ||
                                    order.shippingStatus === "delivered" || 
                                    order.shippingStatus === "pickedup" ||
                                    order.shippingStatus === "cancelled") &&
                                    parseOrderState(order.shippingStatus)
                                  }
                            </TableCell>
                          }       
                          <TableCell align="center">{order.address}</TableCell>
                          <TableCell align="right">$ {order.totalPrice}</TableCell>                   
                          <TableCell align="right">$ {order.shippingPrice}</TableCell>
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