import { Grid } from "@material-ui/core";
import ProductCard from "./ProductCard";

const ProductGrid = ({products}) => {
  return (
    <Grid container spacing={3}>
      {
        products?.map(p => 
          <Grid key={p.id} item xs={6} lg={4}>
            <ProductCard product={p} />
          </Grid>
        )
      }
    </Grid>
  );
};

export default ProductGrid;
