import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Card, CardMedia } from '@material-ui/core';

const CarouselItem = ({picture}) => {
  return (
    <Card xs={12}>
      <CardMedia component='img' image={picture} />
    </Card>
  );
}

const ProductCarousel = ({product}) =>
{
  return (
    <Carousel>
      { product.pictures.map(p => <CarouselItem key={p.id} picture={p.picture} />) }
    </Carousel>
  )
}

export default ProductCarousel;