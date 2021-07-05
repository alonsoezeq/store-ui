import { Button, FormControl, Grid, Input, InputLabel, ListItemIcon, makeStyles, MenuItem, Paper, Select, TextField, Typography, Switch } from "@material-ui/core"
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
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "90vw",
    height: "75vh",
  },
  paper: {
    padding: "2rem",
  },
  inputText: {
    width: "25vw",
  },
  inputTextField: {
    width: "35vw",
  },
  inputSelect: {
    width: "10vw",
  },
  inputNumber: {
    width: '8vw'
  }
}));

const ProductAddForm = () => {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [ context, setContext ] = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [editPicture, setState] = useState({checkedA: false});

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
  const handleChangeEditPicture = (event) => {
    setState({ ...editPicture, [event.target.name]: event.target.checked });
  };
  return (
    <>
      {
        !context.loading && product &&
        <Paper className={classes.paper} elevation={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">Editar producto</Typography>
        </Grid>
        <br/>
        <br/>
        <br/>

        <form autoComplete="off" className={classes.container} onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={6}>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="product">Producto</InputLabel>
                  <Input id="product" name="title" type="text" className={classes.inputText} value={product.title} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="article">Artículo</InputLabel>
                  <Input id="article" name="article" type="text"className={classes.inputText}  value={product.article} onChange={handleChange} />
                </FormControl>
              </Grid>
            </Grid>
            

            <Grid item xs={6}>
                    {/* <InputLabel htmlFor="pictures">Editar fotos del producto</InputLabel>
                    <Switch checked={editPicture.checkedA} onChange={handleChangeEditPicture} name="checkedA" inputProps={{ 'aria-label': 'secondary checkbox' }}/>
                  { editPicture && */}
              <FormControl className={classes.root}>
                <InputLabel htmlFor="pictures">Fotos del producto</InputLabel>
                <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} />
              </FormControl>
              {/* } */}
            </Grid>
            
          </Grid>
          <Grid container justify="space-between">
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="size">Talle</InputLabel>
                <Select id="size" name="size" className={classes.inputSelect} value={product.size} onChange={handleChange}>
                  {
                    sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="color">Color</InputLabel>
                <Select id="color" name="color" className={classes.inputSelect} value={product.color} onChange={handleChange}>
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
                <Select id="category" name="category" className={classes.inputSelect} value={product.category} onChange={handleChange}>
                  {
                    categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="gender">Género</InputLabel>
                <Select id="gender" name="gender" className={classes.inputSelect} value={product.gender} onChange={handleChange}>
                  {
                    genders.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <FormControl className={classes.root}>
              <TextField
                id="description"
                name="description"
                label="Descripción"
                placeholder="Escriba la descripción..."
                multiline
                variant="outlined"
                className={classes.inputTextField}
                value={product.description} 
                onChange={handleChange} 
                required
              />
                {/* <InputLabel htmlFor="description">Descripción</InputLabel>
                <TextField id="description" name="description" multiline rows={4} value={product.description} onChange={handleChange} /> */}
              </FormControl>
            </Grid>

              <Grid item xs={3} >
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="quantity">Cantidad</InputLabel>
                  <Input id="quantity" name="quantity" className={classes.inputNumber} type="number" inputProps={{ min:"0",inputMode:"numeric"}} value={product.quantity} onChange={handleNumberChange} />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="price">Precio</InputLabel>
                  <Input id="price" name="price" className={classes.inputNumber} type="number" min="0" inputProps={{ min:"0",inputMode:"numeric"}} value={product.price} onChange={handleNumberChange} />
                </FormControl>
              </Grid>

          </Grid>
            <Grid container justify="flex-end">
              <FormControl className={classes.root}>
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Modificar producto
                </Button>
              </FormControl>
            </Grid>
        </form>
        </Paper>
      }
    </>
  );
}

export default ProductAddForm;