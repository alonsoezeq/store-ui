import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Paper, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  inputText: {
    width: "20vw",
  },
}));

const StoreAddForm = () => {
  const classes = useStyles();
  const [ context, setContext ] = useContext(AppContext);

  const initialStore = {
    name: '',
    address: '',
    pictures: []
  };

  const [ store, setStore ] = useState(initialStore);

  const { name, address } = store;

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/stores`, {
      method: 'POST',
      body: JSON.stringify(store),
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
        message: 'TIenda correctamente agregada.'
      });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }

  const handleChange = (event) => {
    setStore({ ...store, [event.target.name]: event.target.value });
  }

  const handleFileChange = (event) => {
    let files = [];
    if (event.target.files.length === 0) {
      setStore({ ...store, [event.target.name]: files });
    }

    Array.from(event.target.files).forEach(file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        files = [ ...files, { "picture": reader.result } ];
        setStore({ ...store, [event.target.name]: files });
      }
      reader.onerror = (error) => {
        setContext({ ...context, status: 'error', message: error });
      }
    });
  }

  return (
    <Grid container justify="center" >
      <Paper style={{"padding": "2rem 5rem"}} elevation={3}>
        <Grid container style={{"marginBottom":"2rem"}} justify="center">
          <Typography variant="h4">Agregar Tienda</Typography>
        </Grid>
        <form  autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2} >
            <Grid item xs={6}>
              <Grid item xs={12}>
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="name">Nombre</InputLabel>
                  <Input id="name" name="name" type="text" className={classes.inputText} value={name} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item xs={12}> 
                <FormControl required className={classes.root}>
                  <InputLabel htmlFor="address">Dirección</InputLabel>
                  <Input id="address" name="address" type="text" className={classes.inputText} value={address} onChange={handleChange} />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="pictures">Fotos de la tienda</InputLabel>
                <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} />
              </FormControl>
            </Grid>
            <Grid container justify={"flex-end"}>
              <FormControl className={classes.root}>
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Crear tienda
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default StoreAddForm;