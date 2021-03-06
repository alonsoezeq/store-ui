import { Button, FormControl, Grid, Input, InputLabel, ListItemIcon, makeStyles, MenuItem, Paper, Select, TextField, Typography} from "@material-ui/core"
import { useContext, useEffect, useState } from "react";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import categories from "../config/categories.json";
import colors from "../config/colors.json";
import genders from "../config/genders.json";
import priorities from "../config/priorities.json";
import sizes from "../config/sizes.json";
import { FiberManualRecord } from "@material-ui/icons";
import {DropzoneDialog} from 'material-ui-dropzone';

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
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [ context, setContext ] = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [editPicture, setState] = useState({checkedA: false});
  const [ files, setFiles] = useState([]);
  const [ open, setOpen ] = useState(false);

  useEffect(() => {
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/products/${id}`)
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then( data => {
      let filesAux = []
      data.pictures.forEach( picture => {
        //console.log(picture);
        filesAux.push(picture.picture);

        setFiles(filesAux);
      })

      setProduct(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: 'Error al traer el producto seleccionado.' });
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
    console.log(product)
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
        message: 'Producto correctamente editado!'
      });
      history.push('/');
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: 'Error al editar el producto.' });
    });
  }
  const handleChangeEditPicture = (event) => {
    setState({ ...editPicture, [event.target.name]: event.target.checked });
  };

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = (files) => {
    let images = [];
      files.forEach((file)=> {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          images = [ ...images, { "picture": reader.result} ];
          setProduct({ ...product, pictures: images });
          setOpen(false)
        }
        reader.onerror = (error) => {
          setContext({ ...context, status: 'error', message: error });
          setOpen(false)
        }
      })
  }

  const handleOpen= () => {
      setOpen(true);
  }

  return (
    <>
      {
        !context.loading && product &&
        <Grid container justify="center" alignContent="center">
          <Paper className={classes.paper} elevation={3}>
            <form autoComplete="off" className={classes.container} onSubmit={handleSubmit}>
              <Grid item xs={12}>
                <Typography variant="h4" align="center">Editar producto</Typography>
              </Grid>
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
                        <InputLabel htmlFor="article">Art??culo</InputLabel>
                        <Input id="article" name="article" type="text"className={classes.inputText}  value={product.article} onChange={handleChange} />
                      </FormControl>
                    </Grid>
                  </Grid>           
                  <Grid item xs={6}>
                    <FormControl className={classes.root}>
                      {/* <InputLabel htmlFor="pictures">Fotos del producto</InputLabel>
                      <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} /> */}
                    <Button onClick={handleOpen}>
                     Agregar imagen
                    </Button>
                    <DropzoneDialog
                        open={open}
                        initialFiles = {files}
                        onSave={handleSave}
                        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                        showFileNames={false}
                        dropzoneText="Arraste aqu?? el archivo o haga click para seleccionar."
                        showFileNamesInPreview={false}
                        showPreviews={true}
                        maxFileSize={5000000}
                        dialogTitle="Cargar fotos"
                        cancelButtonText="Cancelar"
                        submitButtonText="Agregar"
                        showAlerts={false}
                        onClose={handleClose}
                        clearOnUnmount={false}
                    />
                    </FormControl>
                    <FormControl required className={classes.root}>
                      <InputLabel htmlFor="priority">Prioridad de venta</InputLabel>
                      <Select id="priority" name="priority" className={classes.inputSelect} value={product.priority} onChange={handleChange}>
                        {
                          priorities.map((label, index) => <MenuItem key={index} value={index}>{label}</MenuItem>)
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                 </Grid>
               <Grid container >
                 <Grid item xs={6}>
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
                </Grid>
                <Grid xs={6}>
                <Grid item>
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="category">Categor??a</InputLabel>
                    <Select id="category" name="category" className={classes.inputSelect} value={product.category} onChange={handleChange}>
                      {
                        categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                    <FormControl required className={classes.root}>
                      <InputLabel htmlFor="gender">G??nero</InputLabel>
                      <Select id="gender" name="gender" className={classes.inputSelect} value={product.gender} onChange={handleChange}>
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
                label="Descripci??n"
                placeholder="Escriba la descripci??n..."
                multiline
                variant="outlined"
                className={classes.inputTextField}
                value={product.description} 
                onChange={handleChange} 
                required
              />
                {/* <InputLabel htmlFor="description">Descripci??n</InputLabel>
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
        </Grid>
      }
    </>
  );
}

export default ProductAddForm;