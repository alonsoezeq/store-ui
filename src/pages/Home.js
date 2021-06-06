import { CircularProgress, Grid, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { React, useEffect, useState } from 'react';
import AppCarousel from '../components/AppCarousel';
import ProductGrid from '../components/ProductGrid';
import config from '../config/config';

const Home = () => {

  const [state, setState] = useState({
    loading: true,
    products: [],
    error: null
  });

  const {loading, products, error} = state;

  useEffect(() => {
    fetch(config.baseApi + '/products')
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
          <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
                <AppCarousel products={products} />
            </Grid>
            <Grid item xs={12}>
              <ProductGrid products={products} />
            </Grid>
          </Grid>
        </>)
      }
    </>
  );

}

export default Home;