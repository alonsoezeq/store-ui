import { FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { useState } from "react";
import useStyles from "./ProductDescription/styles";
import config from "../config/config";

const NewProduct = () => {
  const classes = useStyles();
  const [product, setProduct] = useState({
    title: '',
    article: '',
    pictures: [],
    size: '',
    color: '#000000',
    category: '',
    description: '',
    quantity: 0,
    price: 0
  });

  const {title, article, size, color, category, description, quantity, price} = product;

  const changeHandler = (event) => {
    setProduct({...product, [event.target.name]: event.target.value});
  }

  const changeNumberHandler = (event) => {
    setProduct({...product, [event.target.name]: Number(event.target.value)})
  }

  const changeFileHandler = (event) => {
    let files = [];
    if (event.target.files.length === 0) {
      setProduct({...product, [event.target.name]: files});
    }

    Array.from(event.target.files).forEach(file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        files = [...files, {"picture": reader.result}];
        setProduct({...product, [event.target.name]: files});
      }
      reader.onerror = (error) => {
        console.log("Error loading file: ", error);
      }
    });
  }

  const submit = (event) => {
    event.preventDefault();
    console.log(product);

    fetch(config.baseApi + '/products', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        alert("OK!");
      } else {
        alert("ERROR!");
      }
    })
    .catch(err => {
      alert("ERROR!");
    })
  }

  return (
    <form noValidate autoComplete="off" onSubmit={submit}>
      <Grid container direction="column">
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="product">Producto</InputLabel>
            <Input id="product" name="title" type="text" value={title} onChange={changeHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="article">Artículo</InputLabel>
            <Input id="article" name="article" type="text" value={article} onChange={changeHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="pictures">Fotos del producto</InputLabel>
            <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={changeFileHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="size">Talle</InputLabel>
            <Select id="size" name="size" value={size} onChange={changeHandler}>
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
            <Input id="color" name="color" type="color" value={color} onChange={changeHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="category">Categoría</InputLabel>
            <Input id="category" name="category" type="text" value={category} onChange={changeHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="description">Descripción</InputLabel>
            <TextField id="description" name="description" multiline rows={4} value={description} onChange={changeHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="quantity">Cantidad</InputLabel>
            <Input id="quantity" name="quantity" type="number" min="1" value={quantity} onChange={changeNumberHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="price">Precio</InputLabel>
            <Input id="price" name="price" type="number" min="0" value={price} onChange={changeNumberHandler} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <Input id="submit" name="submit" type="submit" value="Cargar producto" />
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
}

export default NewProduct;