import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Card, CardMedia, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  picture: {
    width: 400,
    height: 400
  }
});

const CarouselItem = ({product}) => {
  const classes = useStyles();

  return (
    <Card xs={12}>
      <CardMedia component='img' image={product.pictures[0].picture} title={product.title} className={classes.picture} />
    </Card>
  );
}

const AppCarousel = ({products}) =>
{
  return (
    <Carousel>
      { products.map(p => <CarouselItem key={p.id} product={p} />) }
    </Carousel>
  )
}

export default AppCarousel;