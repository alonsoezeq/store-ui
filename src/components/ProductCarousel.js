import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { CardMedia, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  picture: {
    width: 400,
    height: 400
  }
});

const ProductCarousel = ({product}) =>
{
  const classes = useStyles();

  return (
    <Carousel>
      { 
        product?.pictures.map(p => (
          <CardMedia key={p.id} component='img' image={p.picture} className={classes.picture} />
        ))
      }
    </Carousel>
  );
}

export default ProductCarousel;