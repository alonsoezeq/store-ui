import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Grid from '@material-ui/core/Grid';
import ProductCarousel from './ProductCarousel';

const URL = 'http://localhost:3000/api/v1/products/'

const ProductDescription = () => {

    const { id } = useParams(); //Recupero el parametro de la ruta
    
    const [product, setProduct] = useState();
    const [mensaje, setMensaje] = useState("Cargando...");

    const getProduct = () => {

      fetch(URL + id)
      .then((res) => {
        return res.ok ? res.json() : Promise.reject(res);
      })
      .then((data) => {
        console.log("Traigo el producto", data);
        setProduct(data);
      })
      .catch((error) => {
        setMensaje("Error al recuperar el producto!");
        console.log(error);
      })
    }
    
    useEffect(getProduct, [id]);

    return ( 
        <div>
          <h1>Descripcion del producto</h1>
          { product !== undefined?
            <Grid container spacing={2} direction="column" justify="center" alignItems="center">
              <Grid container direction="row" justify="space-around" alignItems="center">
                <Grid item>
                  <ProductCarousel product={product} />
                </Grid>
                <Grid item>
                  <h1>{product.title}</h1>
                  <div>
                    <p>Tamaño: {product.size.toUpperCase()}</p>
                    <p>Color: {product.color.toUpperCase()}</p>
                    <p>Categoría: {product.category.toUpperCase()}</p>
                  </div>
                </Grid>
              </Grid>
              <Grid container direction="column">
                <Grid item>
                  <h2>Descripción del producto</h2>
                  <p>{product.description}</p>
                </Grid>
                <Grid container direction="row" justify="flex-end" spacing={4}>
                  <Grid item>
                    <p>Cantidad de stock {product.quantity}</p>  
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary">Agregar al carrito</Button>
                  </Grid>  
                </Grid>                
              </Grid>                                     
            </Grid> : 
            <div>
                <h3>{mensaje}</h3>
            </div>
          }
        </div> 
    );
}
 
export default ProductDescription;