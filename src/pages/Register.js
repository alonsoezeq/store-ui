import { Button, FormControl, Grid, Input, InputLabel, makeStyles, Paper, Typography, Select, MenuItem } from "@material-ui/core"
import { useContext, useState } from "react";
import config from "../config/config";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router-dom";
import provinces from "../config/provinces.json";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2)
  },
  inputText: {
    width:'20vw'
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
    password: '',
    address: '',
    province: ''
  });

  const {username, fullname, email, password, address, province } = user;

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
        message: 'Alta realizada exitosamente!'
      });
      history.push('/');
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: 'Ocurrió un error al realizar la registración.' });
    });
  }

  return (
    <Grid container justify="center" alignItems="center" style={{"height": "85vh"}}>
      <Paper elevation={3} style={{padding: "3rem"}}>
        <Grid container justify="center" style={{marginBottom: "2rem"}}>
          <Typography variant="h4"> Registro de usuario</Typography>
        </Grid>
        <form  autoComplete="off" onSubmit={handleSubmit} style={{"width": "22vw"}}>
          <Grid container direction="column">
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="username">Nombre de usuario</InputLabel>
                <Input id="username" name="username" type="text" className={classes.inputText} value={username} onChange={handleChange}/>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="fullname">Nombre completo</InputLabel>
                <Input id="fullname" name="fullname" type="text" className={classes.inputText} value={fullname} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="email">E-Mail</InputLabel>
                <Input id="email" name="email" type="email" className={classes.inputText} value={email} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="password">Contraseña</InputLabel>
                <Input id="password" name="password" type="password" className={classes.inputText} value={password} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="address">Dirección</InputLabel>
                <Input id="address" name="address" type="text" className={classes.inputText} value={address} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="province">Provincia</InputLabel>
                <Select id="province" name="province" className={classes.inputText} value={province} onChange={handleChange}>
                {
                  Object.keys(provinces).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)
                }
              </Select>
              </FormControl>
            </Grid>
            <Grid container justify="flex-end">
              <FormControl className={classes.root}>
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Registrarme
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}

export default Register;