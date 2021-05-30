import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const URL = 'http://localhost:3000/api/v1/products/1'

const ProductDescription = () => {

  const { id } = useParams(); //Recupero el parametro de la ruta
    
    const [product, setProduct] = useState();
    const [mensaje, setMensaje] = useState("Cargando...")
    const getProduct = () => {

      fetch(URL)
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
    
    useEffect(getProduct, []);

    return ( 
        <div>
          <h1>Descripcion del producto</h1>
          { product !== undefined?
            <div>
              <h1>{product.title}</h1>
              <p>{product.description}</p>
              <img alt={`product ${product.title}`} src={product.pictures[0].picture}/>
            </div> : 
            <div>
                <h3>{mensaje}</h3>
            </div>
          }          
        </div> 
    );
}
 
export default ProductDescription;