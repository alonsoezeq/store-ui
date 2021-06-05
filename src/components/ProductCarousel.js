import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { CardMedia, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  picture: {
    width: 400,
    height: 400
  }
});

const CarouselItem = ({picture}) => {
  const classes = useStyles();

  return (
    <div>
      <CardMedia component='img' image={picture} className={classes.picture} />
    </div>
  );
}

const ProductCarousel = ({product}) =>
{
  return (
    <Carousel>
      { product?.pictures.map(p => <CarouselItem key={p.id} picture={p.picture} />) }
    </Carousel>
  )
}

export default ProductCarousel;