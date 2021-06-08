import { Button, FormControl, Grid, Input, InputLabel, makeStyles, MenuItem, Select, Snackbar, TextField } from "@material-ui/core"
import { useState } from "react";
import config from "../config/config";
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const NewProduct = () => {
  const classes = useStyles();
  
  const [state, setState] = useState({
    loading: false,
    status: null,
    message: ''
  });

  const initialProduct = {
    title: '',
    article: '',
    pictures: [],
    size: '',
    color: '#000000',
    category: '',
    description: '',
    quantity: '',
    price: ''
  }

  const [product, setProduct] = useState(initialProduct);

  const {loading, status, message} = state;
  const {title, article, size, color, category, description, quantity, price} = product;

  const handleChange = (event) => {
    setProduct({...product, [event.target.name]: event.target.value});
  }

  const handleNumberChange = (event) => {
    setProduct({...product, [event.target.name]: Number(event.target.value)})
  }

  const handleFileChange = (event) => {
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
        setState({...state, status: 'error', message: error});
      }
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setState({
      loading: true,
      status: null,
      message: ''
    })

    fetch(config.baseApi + '/products', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        setState({
          loading: false,
          status: 'success',
          message: 'Producto creado correctamente'
        });
        setProduct(initialProduct);
      } else {
        setState({
          loading: false,
          status: 'error',
          message: 'Error creando el producto'
        });
      }

    })
    .catch(err => {
      setState({
        loading: false,
        status: 'error',
        message: err.toString()
      });
    })
  }

  const handleSnackbarClose = () => {
    setState({
      loading: false,
      status: null,
      message: ''
    });
  }

  return (
    <form  autoComplete="off" onSubmit={handleSubmit}>
      <Grid container direction="column">
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="product">Producto</InputLabel>
            <Input id="product" name="title" type="text" value={title} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="article">Artículo</InputLabel>
            <Input id="article" name="article" type="text" value={article} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="pictures">Fotos del producto</InputLabel>
            <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="size">Talle</InputLabel>
            <Select id="size" name="size" value={size} onChange={handleChange}>
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
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="color">Color</InputLabel>
            <Input id="color" name="color" type="color" value={color} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="category">Categoría</InputLabel>
            <Input id="category" name="category" type="text" value={category} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <InputLabel htmlFor="description">Descripción</InputLabel>
            <TextField id="description" name="description" multiline rows={4} value={description} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="quantity">Cantidad</InputLabel>
            <Input id="quantity" name="quantity" type="number" min="1" value={quantity} onChange={handleNumberChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="price">Precio</InputLabel>
            <Input id="price" name="price" type="number" min="0" value={price} onChange={handleNumberChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={loading}>
              Cargar producto
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      {
        status && 
        <Snackbar open autoHideDuration={6000}>
          <Alert severity={status} onClose={handleSnackbarClose}>{message}</Alert>
        </Snackbar>
      }
    </form>
  );
}

export default NewProduct;