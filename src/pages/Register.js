import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Snackbar } from "@material-ui/core"
import { useState } from "react";
import config from "../config/config";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const Register = () => {
  const classes = useStyles();
  const history = useHistory();

  const initialState = {
    loading: false,
    status: null,
    message: ''
  };

  const initialUser = {
    username: '',
    fullname: '',
    email: '',
    password: ''
  };

  const [state, setState] = useState(initialState);
  const [user, setUser] = useState(initialUser);
  const {loading, status, message} = state;
  const {username, fullname, email, password} = user;

  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setState({
      loading: true,
      status: null,
      message: ''
    })

    fetch(`${config.baseApi}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        setState({
          loading: false,
          status: 'success',
          message: 'Usuario registrado correctamente'
        });
        setUser(initialUser);
        history.push('/');
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

  const handleSnackbarClose = () => {
    setState(initialState);
  }

  return (
    <form  autoComplete="off" onSubmit={handleSubmit}>
      <Grid container direction="column">
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="username">Nombre de usuario</InputLabel>
            <Input id="username" name="username" type="text" value={username} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="fullname">Nombre completo</InputLabel>
            <Input id="fullname" name="fullname" type="text" value={fullname} onChange={handleChange} />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl required className={classes.root}>
            <InputLabel htmlFor="email">E-Mail</InputLabel>
            <Input id="email" name="email" type="email" value={email} onChange={handleChange} />
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
              Registrarme
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

export default Register;