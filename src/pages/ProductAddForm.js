import { Button, FormControl, Grid, Input, InputLabel, ListItemIcon, makeStyles, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core"
import { useContext, useState } from "react";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";
import { AppContext } from "../AppContext";
import categories from "../config/categories.json";
import colors from "../config/colors.json";
import genders from "../config/genders.json";
import priorities from "../config/priorities.json";
import sizes from "../config/sizes.json";
import { FiberManualRecord } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  paper: {
    padding: "2rem",
  },
  inputText: {
    width: "15vw",
  },
  inputTextField: {
    width: "12w",
  },
  inputSelect: {
    width: "15vw",
  },
  inputNumber: {
    width: '8vw'
  }
}));

const ProductAddForm = () => {
  const classes = useStyles();
  const [ context, setContext ] = useContext(AppContext);

  const initialProduct = {
    title: '',
    article: '',
    pictures: [],
    size: '',
    color: '',
    category: '',
    gender: '',
    description: '',
    quantity: '',
    price: '',
    priority: 0
  }

  const [ product, setProduct ] = useState(initialProduct);

  const {title, article, size, color, category, gender, description, quantity, price, priority } = product;

  const handleChange = (event) => {
    setProduct({...product, [event.target.name]: event.target.value});
  }

  const handleNumberChange = (event) => {
    setProduct({...product, [event.target.name]: Number(event.target.value)})
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

    setContext({ ...context, loading: false });

    fetch(`${config.baseApi}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setContext({
        ...context,
        loading: false,
        status: 'success',
        message: 'Producto creado correctamente'
      });
      setProduct(initialProduct);
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: "Ocurrió un error!!" });
    });
  }

  return (
    <Grid container justify="center" alignContent="center">
      <Paper className={classes.paper} elevation={3}>
        <form  autoComplete="off" onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">Agregar producto</Typography>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="product">Producto</InputLabel>
                  <Input id="product" name="title" type="text" className={classes.inputText} value={title} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="article">Artículo</InputLabel>
                  <Input id="article" name="article" type="text" className={classes.inputText} value={article} onChange={handleChange} />
                </FormControl>
              </Grid>
            </Grid>        
            <Grid item xs={6}>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="pictures">Fotos del producto</InputLabel>
                <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} />
              </FormControl>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="priority">Prioridad de venta</InputLabel>
                <Select id="priority" name="priority" className={classes.inputSelect} value={priority} onChange={handleChange}>
                  {
                    priorities.map((label, index) => <MenuItem key={index} value={index}>{label}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="size">Talle</InputLabel>
                  <Select id="size" name="size" className={classes.inputSelect} value={size} onChange={handleChange}>
                    {
                      sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="color">Color</InputLabel>
                  <Select id="color" name="color" className={classes.inputSelect} value={color} onChange={handleChange}>
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
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="category">Categoría</InputLabel>
                  <Select id="category" name="category" className={classes.inputSelect}  value={category} onChange={handleChange}>
                    {
                      categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="gender">Género</InputLabel>
                  <Select id="gender" name="gender" className={classes.inputSelect} value={gender} onChange={handleChange}>
                    {
                      genders.map(gender => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
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
                    value={description} 
                    onChange={handleChange} 
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Grid item >
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="quantity">Cantidad</InputLabel>
                    <Input id="quantity" name="quantity" type="number"  className={classes.inputNumber}  inputProps={{ min:"0",inputMode:"numeric"}} value={quantity} onChange={handleNumberChange} />
                  </FormControl>
                </Grid>
                <Grid item >
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="price">Precio</InputLabel>
                    <Input id="price" name="price" type="number"  className={classes.inputNumber} inputProps={{ min:"0",inputMode:"numeric"}} min="0" value={price} onChange={handleNumberChange} />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify={"flex-end"}>
              <Grid item>
                <FormControl className={classes.root}>
                  <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                    Cargar producto
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default ProductAddForm;