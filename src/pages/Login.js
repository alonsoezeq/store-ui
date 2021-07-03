import { Button, FormControl, Grid, Input, InputLabel, makeStyles } from "@material-ui/core";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../AppContext";
import config from "../config/config";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const Login = () => {
  const classes = useStyles();
  const [ identity, setIdentity ] = useState({ username: '', password: '' });
  const [ context, setContext ] = useContext(AppContext);

  const { username, password } = identity;

  const handleChange = (event) => {
    setIdentity({...identity, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/auth`, {
      method: 'POST',
      body: JSON.stringify(identity),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      localStorage.setItem('token', data.token.toString());
      setContext({
        ...context,
        loading: false,
        status: 'success',
        message: 'Successfuly authenticated'
      });
      window.location.href = '/';
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }

  return (
    <>
      {
        !context.loading &&
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
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Iniciar sesión
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      }
    </>
  );
}

export default Login;