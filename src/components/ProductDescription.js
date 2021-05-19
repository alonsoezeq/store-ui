import React, { useEffect, useState } from 'react';

const URL = 'http://localhost:3000/api/v1/products/1'

const ProductDescription = () => {
    
    const [product, setProduct] = useState();
    const getProduct = () => {
        fetch(URL)
      .then((res) => {
        return res.ok ? res.json() : Promise.reject(res);
      })
      .then((data) => {
        console.log("Traigo el producto", data);
        setProduct(data)
      })
      .catch((error) => {
        console.log(error);
      })
    }
    
    useEffect(getProduct, []);

    return ( 
        <div>
          { product != undefined &&
            <div>
              <h1>{product.title}</h1>
              <p>{product.description}</p>
              <img src={product.pictures[0].picture}/>
            </div>
          }          
        </div> 
    );
}
 
export default ProductDescription;