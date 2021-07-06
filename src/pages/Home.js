import { Grid } from '@material-ui/core';
import { React, useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import AppCarousel from '../components/AppCarousel';
import ProductGrid from '../components/ProductGrid';
import Banner from '../components/Banner';
import config from '../config/config';

const Home = () => {
  const [ products, setProducts ] = useState([]);
  const [ context, setContext ] = useContext(AppContext);

  useEffect(() => {
    let params;
    setContext({ ...context, loading: true });

    if(window.location.search.length > 0){
      params = window.location.search.slice(1);
    }
    
    fetch(`${config.baseApi}/products/?active=1&${params}`)
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
              {/* <AppCarousel products={products} /> */}
              <Banner></Banner>
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