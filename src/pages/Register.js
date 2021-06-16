import { Button, FormControl, Grid, Input, InputLabel, makeStyles } from "@material-ui/core"
import { useContext, useState } from "react";
import config from "../config/config";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

const Register = () => {
  const classes = useStyles();
  const history = useHistory();
  const [ context, setContext ] = useContext(AppContext);
  const [user, setUser] = useState({
    username: '',
    fullname: '',
    email: '',
    password: ''
  });

  const {username, fullname, email, password} = user;

  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value});
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setContext({
        ...context,
        loading: false,
        status: 'success',
        message: 'User created'
      });
      history.push('/');
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
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
            <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
              Registrarme
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
}

export default Register;