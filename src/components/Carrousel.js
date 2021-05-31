import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { useHistory } from 'react-router';

const URL = 'http://localhost:3000/api/v1/products';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    width: "85vw",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

const Carrousel = () => {
    const classes = useStyles();
    const [productList, setProductList] = useState();
    const [mensaje, setMensaje] = useState("Cargando...");

    let history = useHistory();

    const getProducts = () => {

        fetch(URL)
        .then((res) => {
          return res.ok ? res.json() : Promise.reject(res);
        })
        .then((data) => {
          console.log("Traigo la lista de productos", data);
          console.log(data)
          setProductList(data);
          
        })
        .catch((error) => {
          setMensaje("Error al recuperar la lista!");
          console.log(error);
        })
    }

    
    const handleClick = (id) => {
      console.log(id);
      history.push("/description/" + id);
    }


    useEffect(getProducts, []);

    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={2} spacing={6} cellHeight={200}>
          { productList !== undefined ? productList?.map((product) => (
            <GridListTile style={{cursor:"pointer"}} key={product.id} onClick={() => handleClick(product.id)}>
              <img src={product.pictures[0].picture} alt={product.title} />
              <GridListTileBar
                title={product.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          )) : <GridListTile>{mensaje}</GridListTile>}
        </GridList>
      </div>
    );
}
 
export default Carrousel;