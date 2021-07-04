import { Box, Button, Chip, Paper, Typography } from '@material-ui/core';
import { React, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import ProductCarousel from '../../components/ProductCarousel';
import useStyles from './styles';
import config from '../../config/config';
import { authHeader, isBuyer } from '../../helpers/AuthUtils';
import { AppContext } from '../../AppContext';
import { FiberManualRecord } from '@material-ui/icons';
import colors from "../../config/colors.json";

const ProductDescription = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [ context, setContext ] = useContext(AppContext);
  const [ product, setProduct ] = useState(null);
  const { cartitems } = context;

  const addProductToCart = (quantity) => {
    const item = cartitems.find(({ productId }) => productId === id);
    const newitem = {
      ...item,
      productId: product.id,
      quantity: item ? item.quantity + quantity : quantity
    };

    fetch(`${config.baseApi}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(newitem)
    })
    .then((res) => res.ok ? res : Promise.reject(res.statusText))
    .then((data) => {
      const newcart = [
        ...cartitems.filter((item) => item.productId !== id),
        newitem
      ];

      setContext({
        ...context,
        cartitems: newcart,
        status: 'success',
        message: 'Added to cart'
      });      
    })
    .catch(err => {
      setContext({ ...context, status: 'error', message: err });
    });
  }

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
        <Paper className={classes.root} elevation={1}>
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
                <Paper component={'div'} className={classes.product} elevation={1}>
                  <Typography className={classes.productTitle} variant="h4">{product.title}</Typography>
                  <Typography>
                    <Box display="inline" fontWeight="fontWeightBold" m={1}>
                      Talle:
                    </Box>
                    <Chip label={product.size.toUpperCase()} />
                  </Typography>
                  <Typography>
                    <Box display="inline" fontWeight="fontWeightBold" m={1}>
                      Color:
                    </Box>
                    <Chip
                      icon={<FiberManualRecord style={{color: product.color}} fontSize="small" />}
                      label={colors[product.color]}
                    />
                  </Typography>
                  <Typography>
                    <Box display="inline" fontWeight="fontWeightBold" m={1}>
                      Categoría:
                    </Box>
                    <Chip label={product.category.toUpperCase()} />
                  </Typography>
                  <Typography>
                    <Box display="inline" fontWeight="fontWeightBold" m={1}>
                      Género:
                    </Box>
                    <Chip label={product.gender.toUpperCase()} />
                  </Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.root} elevation={1}>
                  <Typography>
                    <Box className={classes.descriptionTitle} fontWeight="fontWeightBold">Descripción</Box>
                    <Box>{product.description}</Box>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            {
              isBuyer() &&
              <Grid item container className={classes.addToCart} direction="row" justify="flex-end" spacing={4}>
                <Grid item>
                {product.quantity > 0 &&
                  <p>Cantidad: {product.quantity} / {product.quantity}</p>
                }
                {product.quantity <= 0 &&
                  <p>No hay stock</p>
                }
                </Grid>
                {product.quantity > 0 &&
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => addProductToCart(1)}>
                    Agregar al carrito
                  </Button>
                </Grid>
                }
              </Grid>
            }
          </Grid>
        </Paper>
      }
    </>
  );
}
 
export default ProductDescription;