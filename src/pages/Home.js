import { Grid } from '@material-ui/core';
import { React, useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import AppCarousel from '../components/AppCarousel';
import ProductGrid from '../components/ProductGrid';
import config from '../config/config';

const Home = () => {
  const [ products, setProducts ] = useState([]);
  const [ context, setContext ] = useContext(AppContext);

  useEffect(() => {
    setContext({ ...context, loading: true });
    
    fetch(`${config.baseApi}/products/?active=1${window.location.search}`)
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setProducts(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, [window.location.search]);

  return (   
    <>
      {
        !context.loading && products.length > 0 &&
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
              <AppCarousel products={products} />
          </Grid>
          <Grid item xs={12}>
            <ProductGrid products={products} setProducts={setProducts}/>
          </Grid>
        </Grid>
      }
    </>
  );

}

export default Home;