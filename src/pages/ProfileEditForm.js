import { Grid } from "@material-ui/core";
import { Box, makeStyles, Paper, Typography, FormControl, Button, InputLabel, Select, MenuItem, Input } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import config from "../config/config";
import provinces from "../config/province.json";
import { authHeader } from "../helpers/AuthUtils";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles(theme => ({
  paper: {
    padding: "2.5rem",
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  inputText: {
    width:'20vw'
  }
}));


const ProfileEditForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [ user, setUser ] = useState(null);
  const [ context, setContext ] = useContext(AppContext);

  useEffect(() => {
    setContext({...context, loading: true});
    
    fetch(`${config.baseApi}/profile`, {
      headers: {
        ...authHeader()
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setUser(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, []);

  const handleChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value});
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user);

    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/profile/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(user)
    })
    .then((res) => res.ok ? res : Promise.reject(res.statusText))
    .then((data) => {
      setContext({ ...context, status: 'success', message: 'Se modificó el perfil correctamente.' });
      history.push('/profile');
    })
    .catch(err => {
      setContext({ ...context, status: 'error', message: err });
    });
  }
  return (
    <>
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
                <Input id="username" name="username" type="text" className={classes.inputText} value={user && user.username} onChange={handleChange}/>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="fullname">Nombre completo</InputLabel>
                <Input id="fullname" name="fullname" type="text" className={classes.inputText} value={user && user.fullname} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="email">E-Mail</InputLabel>
                <Input id="email" name="email" type="email" className={classes.inputText} value={user &&  user.email} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="adress">Dirección</InputLabel>
                <Input id="adress" name="adress" type="text" className={classes.inputText} value={user && user.adress} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl required className={classes.root}>
                <InputLabel htmlFor="province">Provincia</InputLabel>
                <Select id="province" name="province" className={classes.inputText} value={user && user.province} onChange={handleChange}>
                {
                  provinces.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)
                }
              </Select>
              </FormControl>
            </Grid>
            <Grid container justify="flex-end">
              <FormControl className={classes.root}>
                <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                  Editar Perfil
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
    </>
  );
}

export default ProfileEditForm;