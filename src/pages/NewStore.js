import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const NewStore = () => {
  const classes = useStyles();
  
  const initialState = {
    loading: false,
    status: null,
    message: ''
  };
  
  const initialStore = {
    name: '',
    address: '',
    pictures: []
  };
  
  const [state, setState] = useState(initialState);
  const [store, setStore] = useState(initialStore);
  const {loading, status, message} = state;
  const {name, address} = store;

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setState({
      loading: true,
      status: null,
      message: ''
    })

    fetch(`${config.baseApi}/stores`, {
      method: 'POST',
      body: JSON.stringify(store),
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })
    .then(res => {
      if (res.ok) {
        setState({
          loading: false,
          status: 'success',
          message: 'Tienda registrada correctamente'
        });
        setStore(initialStore);
      } else {
        setState({
          loading: false,
          status: 'error',
          message: 'Error al registrar usuario'
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

  const handleChange = (event) => {
    setStore({...store, [event.target.name]: event.target.value});
  }

  const handleFileChange = (event) => {
    let files = [];
    if (event.target.files.length === 0) {
      setStore({...store, [event.target.name]: files});
    }

    Array.from(event.target.files).forEach(file => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        files = [...files, {"picture": reader.result}];
        setStore({...store, [event.target.name]: files});
      }
      reader.onerror = (error) => {
        setState({...state, status: 'error', message: error});
      }
    });
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
            <InputLabel htmlFor="name">Nombre</InputLabel>
            <Input id="name" name="name" type="text" value={name} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="address">Dirección</InputLabel>
            <Input id="address" name="address" type="text" value={address} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="pictures">Fotos de la tienda</InputLabel>
            <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={loading}>
              Crear tienda
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

export default NewStore;