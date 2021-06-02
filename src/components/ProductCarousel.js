import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Card, CardMedia, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  carousel: {
    width: 400,
    height: 400
  },
});

const CarouselItem = ({picture}) => {
  return (
    <Card>
      <CardMedia component='img' image={picture} />
    </Card>
  );
}

const ProductCarousel = ({product}) =>
{
  const classes = useStyles();

  return (
    <Carousel className={classes.carousel}>
      { product?.pictures.map(p => <CarouselItem key={p.id} picture={p.picture} />) }
    </Carousel>
  )
}

export default ProductCarousel;