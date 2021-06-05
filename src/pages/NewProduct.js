import { Button, FormControl, FormHelperText, Grid, Input, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import useStyles from "./ProductDescription/styles";

const NewProduct = () => {
  const classes = useStyles();

  return (
    <form noValidate autoComplete="off">
      <Grid container direction="column">
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="product">Producto</InputLabel>
            <Input id="product" type="text" />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="pictures">Fotos del producto</InputLabel>
            <Input id="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="size">Talle</InputLabel>
            <Select id="size">
              <MenuItem value="XXS">XXS</MenuItem>
              <MenuItem value="XS">XS</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="color">Color</InputLabel>
            <Input id="color" type="color" value="#ff0000" />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="category">Categoría</InputLabel>
            <Input id="category" type="text" />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="description">Descripción</InputLabel>
            <TextField id="description" multiline rows={4} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="quantity">Cantidad</InputLabel>
            <Input id="quantity" type="number" />
          </FormControl>
        </Grid>
        <Grid item>
          <Button>Cargar producto</Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default NewProduct;