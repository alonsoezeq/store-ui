import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import config from '../config/config';
import { authHeader } from '../helpers/AuthUtils';
import { Typography } from '@material-ui/core';
import ProductList from '../components/ProductList';

const ProductSearch = () => {
    const [ context, setContext ] = useContext(AppContext);
    const [ products, setProducts ] = useState([]);
    const { loading } = context;

    const getProducts = () => {
    
        fetch(config.baseApi + '/products', {
            headers: {
              ...authHeader()
            }
          })
          .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
          .then(data => {
            data.sort((a, b) => a.id - b.id);
            setProducts(data);
            setContext({ ...context, loading: false });
            
          })
          .catch(err => {
            setContext({ ...context, loading: false, status: 'error', message: 'Error al traer los productos.' });
          });
    }

    useEffect(() => {
        setContext({ ...context, loading: true });
          
        getProducts();
      }, []);

    return ( 
        <>
        {
            !loading && products.length > 0 &&
            <ProductList products={products} setProducts={setProducts} />
        }
        {
            !loading && products.length === 0 &&
            <Typography>Todavía no se agregaron productos</Typography>
        }        
        </>
     );
}
 
export default ProductSearch;