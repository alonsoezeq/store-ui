import { Box, Button, CircularProgress, Paper, Snackbar, Typography } from '@material-ui/core';
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import ProductCarousel from '../../components/ProductCarousel';
import Alert from '@material-ui/lab/Alert';
import useStyles from './styles';
import config from '../../config/config';

const ProductDescription = () => {
  const { id } = useParams();
  const classes = useStyles();

  const [state, setState] = useState({
    loading: true,
    product: null,
    error: null
  });

  const {loading, product, error} = state;

  useEffect(() => {
    fetch(config.baseApi + '/products/' + id)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => setState({
      loading: false,
      product: data,
      error: null
    }))
    .catch(err => setState({
      loading: false,
      product: null,
      error: err
    }))
  }, []);

  const handleSnackbarClose = () => {
    setState({
      ...state,
      error: null
    });
  }

  return (
    <>
      {!loading && product && (
          <Paper className={classes.root} elevation={3}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <ProductCarousel product={product} />
              </Grid>
              <Grid
                item
                container
                xs={6}
                direction="column"
                justify="flex-start"
                spacing={3}
              >
                <Grid item>
                  <Paper className={classes.product} elevation={3}>
                    <Typography className={classes.productTitle} variant="h4">{product.title}</Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>
                        Talle:
                      </Box>
                      {product.size.toUpperCase()}
                    </Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>
                        Color:
                      </Box>
                      {product.color.toUpperCase()}
                    </Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>
                        Categoría:
                      </Box>
                      {product.category.toUpperCase()}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.root} elevation={1}>
                    <Typography>
                      <Box fontWeight="fontWeightBold">Descripción</Box>
                      <Box>{product.description}</Box>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Grid
                item
                container
                direction="row"
                justify="flex-end"
                spacing={4}
              >
                <Grid item>
                  <p>Cantidad: {product.quantity} / {product.quantity}</p>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">
                    Agregar al carrito
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
      )}
      {loading && <CircularProgress />}
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleSnackbarClose}>
          {error?.toString()}
        </Alert>
      </Snackbar>
    </>
  );
}
 
export default ProductDescription;

/*

  return ( 
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleSnackbarClose}>{error?.toString()}</Alert>
      </Snackbar>
      { loading && <CircularProgress /> }
      { !loading && product && <>
          <Paper className={classes.root} elevation={3}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <ProductCarousel product={product}  />
              </Grid>
              <Grid item container xs={6} direction="column" justify="flex-start" spacing={3}>
                <Grid item>
                  <Paper className={classes.root} elevation={3}>
                    <Typography variant="h4">{product.title}</Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>Talle: </Box>
                      <Box display="inline">{product.size.toUpperCase()}</Box>
                    </Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>Color: </Box>
                      <Box display="inline">{product.color.toUpperCase()}</Box>
                    </Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>Categoría: </Box>
                      <Box display="inline">{product.category.toUpperCase()}</Box>
                    </Typography>
                    <Typography>
                      <Box display="inline" fontWeight="fontWeightBold" m={1}>Stock: </Box>
                      <Box display="inline">{product.quantity}</Box>
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.root} elevation={1}>
                    <Typography>
                      <Box fontWeight="fontWeightBold">Descripción</Box>
                      <Box>{product.description}</Box>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item container direction="row" justify="flex-end" spacing={4}>
                <Grid item>
                  <p>Cantidad de stock {product.quantity}</p>  
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">Agregar al carrito</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </>}
    </>
  );

*/