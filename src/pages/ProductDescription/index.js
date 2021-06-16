import { Box, Button, Paper, Typography } from '@material-ui/core';
import { React, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import ProductCarousel from '../../components/ProductCarousel';
import useStyles from './styles';
import config from '../../config/config';
import { addToCart } from '../../helpers/CartHelpers';
import { isBuyer } from '../../helpers/AuthUtils';
import { AppContext } from '../../AppContext';

const ProductDescription = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [ context, setContext ] = useContext(AppContext);
  const [ product, setProduct ] = useState(null);

  const addProductToCart = (product, quantity) => {
    addToCart(product);
    setContext({ ...context, status: 'success', message: 'Added to cart' });
  };

  useEffect(() => {
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/products/${id}`)
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setProduct(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, [id]);

  return (
    <>
      {
        !context.loading && product && 
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
                <Paper component={'div'} className={classes.product} elevation={3}>
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
            {
              isBuyer() &&
              <Grid item container direction="row" justify="flex-end" spacing={4}>
                <Grid item>
                  <p>Cantidad: {product.quantity} / {product.quantity}</p>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => addProductToCart(product)}>
                    Agregar al carrito
                  </Button>
                </Grid>
              </Grid>
            }
          </Grid>
        </Paper>
      }
    </>
  );
}
 
export default ProductDescription;