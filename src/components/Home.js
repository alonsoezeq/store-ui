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
    <div>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleSnackbarClose}>{error?.toString()}</Alert>
      </Snackbar>
      <Container fixed maxWidth="lg" >
        <Grid container direction="column">
          <Grid item>
            <Box display="flex" justifyContent="center" alignItems="center" xs={12} m={2}> 
              <AppCarousel products={products} />
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" justifyContent="center" alignItems="center" xs={12} m={3}>
            { loading ? <CircularProgress /> : <ProductGrid products={products} /> }
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );

}

export default Home;