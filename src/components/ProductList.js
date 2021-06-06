import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useHistory } from 'react-router';
import config from '../config/config';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));


const ProductList = () => {
    const classes = useStyles();
    const [productList, setProductList] = useState();
    const [mensaje, setMensaje] = useState("Cargando...");

    let history = useHistory();

    const getProducts = () => {

        fetch(config.baseApi + '/products')
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
      history.push("/products/" + id);
    }

    useEffect(getProducts, []);

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile  key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">Pantalones</ListSubheader>
        </GridListTile>
        {
        productList !== undefined ?
        productList.map((product) => (
          <GridListTile  style={{cursor:"pointer"}} key={product.id} onClick={() => handleClick(product.id)}>
            <img src={product.pictures[0].picture} alt={product.title} />
            <GridListTileBar
              title={product.title}
              subtitle={"$ " + product.price}
            />
          </GridListTile>
        )) : <h1>{mensaje}</h1>}
      </GridList>
    </div>
  );
}

export default ProductList;

