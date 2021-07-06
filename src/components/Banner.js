import {React, useState, useEffect} from 'react';
import Carousel from 'react-material-ui-carousel';
import { makeStyles, CardMedia,Card } from '@material-ui/core';
import { images } from "../helpers/BannerData";


const useStyles = makeStyles({
  picture: {
    width: '100%',
    height: 250
  }
});


const Banner = () =>
{
  const classes = useStyles();
  const [imagen, setImagen] = useState();

  useEffect(() => {
    setImagen([...images]);
  }, []);

  return (
    <Carousel>
        { 
        imagen?.map(p => (
          <Card xs={12}>
              <CardMedia component='img' image={p.img} title={p.title} className={classes.picture} />
          </Card>
        ))
      }
    </Carousel>
  )
}

export default Banner;