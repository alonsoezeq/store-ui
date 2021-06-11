import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";
import config from "../config/config";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const Login = () => {
  const classes = useStyles();

  const initialState = {
    loading: false,
    status: null,
    message: ''
  };

  const [state, setState] = useState(initialState);
  const {loading, status, message} = state;

  const [identity, setIdentity] = useState({
    username: '',
    password: ''
  });
  const {username, password} = identity;

  const handleSnackbarClose = () => {
    setState(initialState);
  }

  const handleChange = (event) => {
    setIdentity({...identity, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${config.baseApi}/auth`, {
      method: 'POST',
      body: JSON.stringify(identity),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('token', data.token.toString());
      setState({
        loading: false,
        status: 'success',
        message: 'Ingreso correcto'
      });
      window.location.href = '/';
    })
    .catch(err => {
      console.log("ERR");
      console.log(err);
      setState({
        loading: false,
        status: 'error',
        message: err.toString()
      });
    })
  }

  return (
    <form  autoComplete="off" onSubmit={handleSubmit}>
      <Grid container direction="column">
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="username">Usuario</InputLabel>
            <Input id="username" name="username" type="text" value={username} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <Input id="password" name="password" type="password" value={password} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.root}>
            <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={loading}>
              Iniciar sesión
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

export default Login;