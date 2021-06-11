import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  picture: {
    height: 240
  }
});

const StoreCarousel = ({store}) =>
{
  const classes = useStyles();

  return (
    <Carousel>
      { 
        store?.pictures.map(p => (
          <img src={p.picture} alt={store.name} className={classes.picture} />
        ))
      }
    </Carousel>
  );
}

export default StoreCarousel;