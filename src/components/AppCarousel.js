import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Card, CardMedia } from '@material-ui/core';

const CarouselItem = ({product}) => {
  return (
    <Card xs={12}>
      <CardMedia component='img' image={product.pictures[0].picture} title={product.title} />
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