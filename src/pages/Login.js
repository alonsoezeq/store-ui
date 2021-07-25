import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Paper, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import config from "../config/config";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  inputText: {
    width:'12vw'
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
        message: 'Ingreso correcto!'
      });
      window.location.href = '/';
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: 'La combinación usuario/contraseña es inválida.' });
    });
  }
  
  return (
    <>
      {
        !context.loading &&
        <Grid container justify="center" alignItems="center" style={{"height": "85vh"}}>  
          <Paper elevation={3} style={{padding: "2.5rem"}}>
            <Grid container justify="center" style={{marginBottom: "2rem"}}>
              <Typography variant="h4"> Iniciar sesión</Typography>
            </Grid>
            <form  autoComplete="off" onSubmit={handleSubmit} style={{"width": "16vw"}}>
              <Grid container direction="column">
                <Grid item>
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="username">Usuario</InputLabel>
                    <Input id="username" name="username" type="text" className={classes.inputText} value={username} onChange={handleChange} />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required className={classes.root}>
                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                    <Input id="password" name="password" type="password" className={classes.inputText} value={password} onChange={handleChange} />
                  </FormControl>
                </Grid>
                <Grid container justify="flex-end">
                  <FormControl className={classes.root}>
                    <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                      Iniciar sesión
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

export default Login;