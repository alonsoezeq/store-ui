import { Box, CircularProgress, Container, Grid, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { React, useEffect, useState } from 'react';
import AppCarousel from './AppCarousel';
import ProductGrid from './ProductGrid';

const Home = () => {

  const [state, setState] = useState({
    loading: true,
    products: [],
    error: null
  });

  const {loading, products, error} = state;

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/products')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => setState({
        loading: false,
        products: data,
        error: null
      }))
    .catch(err => setState({
        loading: false,
        products: [],
        error: err
      }));
  }, []);

  const handleSnackbarClose = () => {
    setState({
      ...state,
      error: null
    });
  }

  return (   
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleSnackbarClose}>{error?.toString()}</Alert>
      </Snackbar>
      { loading ? (
        <CircularProgress />
        ) : (<>
          <Grid container spacing={3} justify="center">
            <Grid item>
                <AppCarousel products={products} />
            </Grid>
            <Grid item>
              <ProductGrid products={products} />
            </Grid>
          </Grid>
        </>)
      }
    </>
  );

}

export default Home;