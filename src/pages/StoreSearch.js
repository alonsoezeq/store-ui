import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import config from '../config/config';
import { authHeader } from '../helpers/AuthUtils';
import { Typography } from '@material-ui/core';
import ProductList from '../components/ProductList';
import StoresList from '../components/StoresList';

const StoreSearch = () => {
    const [ context, setContext ] = useContext(AppContext);
    const [ stores, setStores ] = useState([]);
    const { loading } = context;

    const getStores = () => {
    
        fetch(config.baseApi + '/stores', {
            headers: {
              ...authHeader()
            }
          })
          .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
          .then(data => {
            data.sort((a, b) => a.id - b.id);
            setStores(data);
            setContext({ ...context, loading: false });
            
          })
          .catch(err => {
            setContext({ ...context, loading: false, status: 'error', message: 'Error al traer las tiendas.' });
          });
    }

    useEffect(() => {
        setContext({ ...context, loading: true });
          
        getStores();
      }, []);

    return ( 
        <>
        {
            !loading && stores.length > 0 &&
            <StoresList stores={stores} setStores={setStores} />
        }
        {
            !loading && stores.length === 0 &&
            <Typography>Todavía no se agregaron tiendas</Typography>
        }        
        </>
     );
}
 
export default StoreSearch;