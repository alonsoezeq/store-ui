import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Paper, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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

const StoreEditForm = () => {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [ context, setContext ] = useContext(AppContext);

  const [store, setStore] = useState(null);

  useEffect(() => {
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/stores/${id}`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      setStore(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: 'Error al traer la tienda seleccionada.' });
    });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(store),
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
        message: 'Tienda correctamente editada'
      });
      history.push('/stores');
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: 'Error al editar la tienda.' });
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
    <>
      {
        !context.loading && store &&
        <Grid container justify="center">
          <Paper style={{"padding": "2rem 5rem"}} elevation={3}>
            <Grid container style={{"marginBottom":"2rem"}} justify="center">
              <Typography variant="h4">Editar Tienda</Typography>
            </Grid>
            <form  autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
              <Grid item xs={6}>
                <Grid item xs={12}>
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="name">Nombre</InputLabel>
                    <Input id="name" name="name" type="text" className={classes.inputText} value={store.name} onChange={handleChange} />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="address">Dirección</InputLabel>
                    <Input id="address" name="address" type="text" className={classes.inputText} value={store.address} onChange={handleChange} />
                  </FormControl>
                </Grid>
              </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.root}>
                    <InputLabel htmlFor="pictures">Fotos de la tienda</InputLabel>
                    <Input id="pictures" name="pictures" type="file" inputProps={{multiple: true, accept: "image/png, image/jpeg"}} onChange={handleFileChange} />
                  </FormControl>
                </Grid>
                <Grid container justify={"flex-end"}>
                  <FormControl className={classes.root}>
                    <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                      Modificar tienda
                    </Button>
                  </FormControl>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      }
    </>
  );
}

export default StoreEditForm;