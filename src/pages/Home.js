import { Grid, Typography } from '@material-ui/core';
import { React, useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import ProductGrid from '../components/ProductGrid';
import Banner from '../components/Banner';
import config from '../config/config';

const Home = () => {
  const [ products, setProducts ] = useState([]);
  const [ context, setContext ] = useContext(AppContext);
  const [ highPriority, setHighPriority] = useState([]);
  const [ lowPriority, setLowPriority] = useState([]);

  const { loading } = context;

  useEffect(() => {
    let params = '';
    setContext({ ...context, loading: true });

    if(window.location.search.length > 0){
      params = '&' + window.location.search.slice(1);
    }
    
    fetch(`${config.baseApi}/products/?active=1${params}`)
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setProducts(data);
      setHighPriority(data.filter( product => product.priority === 3));
      setLowPriority(data.filter( product => product.priority === 0));
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, [window.location.search]);

  return (   
    <>
      {
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
              <Banner></Banner>
          </Grid>
          { !loading && products.length > 0 && 
            <Grid container spacing={6}>
              { highPriority.length > 0 &&             
                <> 
                  <Grid item xs={12}>
                    <Typography variant="h4">Productos destacados</Typography>
                  </Grid>            
                  <Grid item xs={12}>
                    <ProductGrid products={highPriority} setProducts={setHighPriority}/>
                  </Grid> 
                </> 
              }          
              { lowPriority.length > 0 && 
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4">Productos recomendados</Typography>
                  </Grid> 
                  <Grid item xs={12}>
                    <ProductGrid products={lowPriority} setProducts={setLowPriority}/>
                  </Grid>
                </>
              }
              <Grid item xs={12}>
                <Typography variant="h4">Todos los productos</Typography>
              </Grid>
              <Grid item xs={12}>
                <ProductGrid products={products} setProducts={setProducts}/>
              </Grid>
            </Grid>
          }
          {
            !loading && products.length === 0 &&
            <Typography>No hay productos disponibles</Typography>
          }
        </Grid>
      }
    </>
  );

}

export default Home;