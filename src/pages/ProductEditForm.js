import { Button, FormControl, Grid, Input, InputLabel, ListItemIcon, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core"
import { useContext, useEffect, useState } from "react";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import categories from "../config/categories.json";
import colors from "../config/colors.json";
import genders from "../config/genders.json";
import sizes from "../config/sizes.json";
import { FiberManualRecord } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const ProductAddForm = () => {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [ context, setContext ] = useContext(AppContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/products/${id}`)
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setProduct(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, [id]);

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  }

  const handleNumberChange = (event) => {
    setProduct({ ...product, [event.target.name]: Number(event.target.value) })
  }

  const handleFileChange = (event) => {
    let files = [];
    if (event.target.files.length === 0) {
      setProduct({ ...product, [event.target.name]: files });
    }

    Array.from(event.target.files).forEach(file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        files = [...files, {"picture": reader.result}];
        setProduct({ ...product, [event.target.name]: files });
      }
      reader.onerror = (error) => {
        setContext({ ...context, status: 'error', message: error });
      }
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })
    .then(res => res.ok ? res : Promise.reject(res.statusText))
    .then(() => {
      setContext({
        ...context,
        loading: false,
        status: 'success',
        message: 'Product successfuly edited'
      });
      history.push('/');
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }

  return (
    <>
      {
        !context.loading && product &&
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Grid container direction="column">
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="product">Producto</InputLabel>
                <Input id="product" name="title" type="text" value={product.title} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="article">Artículo</InputLabel>
                <Input id="article" name="article" type="text" value={product.article} onChange={handleChange} />
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
                <Select id="size" name="size" value={product.size} onChange={handleChange}>
                  {
                    sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="color">Color</InputLabel>
                <Select id="color" name="color" value={product.color} onChange={handleChange}>
                  {
                    Object.keys(colors).map((rgb) => 
                      <MenuItem key={rgb} value={rgb}>
                        <ListItemIcon style={{color: rgb}}>
                          <FiberManualRecord fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">{colors[rgb]}</Typography>
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="category">Categoría</InputLabel>
                <Select id="category" name="category" value={product.category} onChange={handleChange}>
                  {
                    categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="gender">Género</InputLabel>
                <Select id="gender" name="gender" value={product.gender} onChange={handleChange}>
                  {
                    genders.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.root}>
                <InputLabel htmlFor="description">Descripción</InputLabel>
                <TextField id="description" name="description" multiline rows={4} value={product.description} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="quantity">Cantidad</InputLabel>
                <Input id="quantity" name="quantity" type="number" min="1" value={product.quantity} onChange={handleNumberChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="price">Precio</InputLabel>
                <Input id="price" name="price" type="number" min="0" value={product.price} onChange={handleNumberChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.root}>
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Modificar producto
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      }
    </>
  );
}

export default ProductAddForm;