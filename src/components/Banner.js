import {React, useState} from 'react';
import Carousel from 'react-material-ui-carousel';
import { makeStyles } from '@material-ui/core';
import { images } from "../helpers/BannerData";


const useStyles = makeStyles({
  picture: {
    width: '100%',
    height: '7%'
  }
});


const Banner = () =>
{
  const classes = useStyles();
  const [imagen, setImagen] = useState([...images]);
  return (
    <Carousel>
        { 
        imagen?.map(p => (
          <img key={p.id} src={p.img} alt={p.title} className={classes.picture} />
        ))
      }
    </Carousel>
  )
}

export default Banner;