import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import OrdersList from '../components/OrdersList';
import config from '../config/config';
import { authHeader, isBuyer } from '../helpers/AuthUtils';
import { Typography } from '@material-ui/core';

const OrdersHistory = () => {
    const [ context, setContext ] = useContext(AppContext);
    const [ orders, setOrders ] = useState([]);
    const { loading } = context;

    const getOrders = () => {
        let endpoint;

        
        if(isBuyer()){
            endpoint = '/purchases';
        } else {
            endpoint = '/sales';
        }

        fetch(config.baseApi + endpoint, {
            headers: {
              ...authHeader()
            }
          })
          .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
          .then(data => {
            
            setOrders(data);
            setContext({ ...context, loading: false });
            
          })
          .catch(err => {
            setContext({ ...context, loading: false, status: 'error', message: err });
          });
    }
   
    useEffect(() => {
      setContext({ ...context, loading: true });
        
      getOrders();
    }, []);
       
    return ( 
        <>
        {
            !loading && orders.length > 0 &&
            <OrdersList orders={orders} setOrders={setOrders}/>
        }
        {
            !loading && orders.length === 0 &&
            <Typography>Todavía no realizó ninguna compra</Typography>
        }
        </>   
    );
}
 
export default OrdersHistory;