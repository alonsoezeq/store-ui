import { Button, FormControl, Grid, Input, InputLabel, makeStyles } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
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
      setContext({ ...context, loading: false, status: 'error', message: err });
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
        message: 'Store successfuly edited'
      });
      history.push('/stores');
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
    <>
      {
        !context.loading && store &&
        <form  autoComplete="off" onSubmit={handleSubmit}>
          <Grid container direction="column">
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input id="name" name="name" type="text" value={store.name} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="address">Dirección</InputLabel>
                <Input id="address" name="address" type="text" value={store.address} onChange={handleChange} />
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
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Modificar tienda
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      }
    </>
  );
}

export default StoreEditForm;