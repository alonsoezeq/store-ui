import { Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from "@material-ui/core"
import { ShoppingCart } from "@material-ui/icons"
import { useHistory } from "react-router";
import ProductCarousel from "./ProductCarousel";

const ProductCard = ({product}) => {
  let history = useHistory();
  const {id, title, description, price} = product;

  let openDetail = (id) => history.push("/products/" + id);

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
        <IconButton aria-label="add to cart">
          <ShoppingCart />
        </IconButton>
        <Typography style={{paddingRight: '1rem', fontWeight: 'bold'}} variant="h5" color="textSecondary" component="h2" align="right">
            $ {price}
          </Typography>
      </CardActions>
    </Card>
  );
}
 
export default ProductCard;