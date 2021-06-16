import { Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from "@material-ui/core"
import { AddShoppingCart, Edit } from "@material-ui/icons"
import { useHistory } from "react-router";
import ProductCarousel from "./ProductCarousel";
import { addToCart } from "../helpers/CartHelpers";
import { isAdmin, isBuyer, isSeller } from "../helpers/AuthUtils";
import { useContext } from "react";
import { AppContext } from "../AppContext";

const ProductCard = ({product}) => {
  const history = useHistory();
  const [ context, setContext ] = useContext(AppContext);
  const { id, title, description, price } = product;

  const openDetail = (id) => history.push("/products/" + id);
  
  const addProductToCart = (product) => {
    addToCart(product);
    setContext({ ...context, status: 'success', message: 'Added to cart' });
  };

  return ( 
    <Card>  
      <ProductCarousel product={product} />
      <CardActionArea onClick={() => openDetail(id)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h5" onClick={() => openDetail(id)}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
        {
          isBuyer() &&
          <IconButton aria-label="add to cart" onClick={() => addProductToCart(product)}>
            <AddShoppingCart />
          </IconButton>
        }
        {
          (isAdmin() || isSeller()) &&
          <IconButton aria-label="edit" onClick={() => history.push(`/products/${product.id}/edit`)}>
            <Edit />
          </IconButton>
        }
        <Typography style={{paddingRight: '1rem', fontWeight: 'bold'}} variant="h5" color="textSecondary" component="h2" align="right">
          $ {price}
        </Typography>
      </CardActions>
    </Card>
  );
}

export default ProductCard;