import { Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from "@material-ui/core"
import { ShoppingCart } from "@material-ui/icons"
import { useHistory } from "react-router";

const ProductCard = ({product}) => {
  let history = useHistory();
  const {id, title, description, pictures, price} = product;

  let openDetail = (id) => history.push("/products/" + id);

  return ( 
    <Card>
      <CardActionArea onClick={() => openDetail(id)}>
        <CardMedia component='img' image={pictures[0].picture} title={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h5" onClick={() => openDetail(id)}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
          <Typography variant="h5" color="textSecondary" component="h2" align="right">
            $ {price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton aria-label="add to cart">
          <ShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
}
 
export default ProductCard;