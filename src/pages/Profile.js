import { Grid } from "@material-ui/core";
import { Box, makeStyles, Paper, Typography, Button, FormControl } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AppContext } from "../AppContext";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: "2.5rem",
  }
}));

const Profile = () => {
  const classes = useStyles();
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
      setContext({ ...context, loading: false, status: 'error', message: 'Error al traer la información del usuario.' });
    });
  }, []);

  return (
    <>
      {
        !context.loading && user &&
        <Grid container justify="center" alignContent="center" style={{"height": "80vh"}}>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="column" justify="space-around">
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Nombre de usuario:
              </Box>
              {user.username}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Nombre completo:
              </Box>
              {user.fullname}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Correo electrónico:
              </Box>
              {user.email}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Rol:
              </Box>
              {user.role==='buyer'? 'Cliente' : user.role==='admin'? 'Administrador': 'Vendedor' }
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Dirección:
              </Box>
              {user.address || ''}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Provincia:
              </Box>
              {user.province}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Fecha de registro:
              </Box>
              {new Date(user.registration).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid container justify="flex-end">
              <FormControl className={classes.root}>
                <Button color="primary">
                  <Link to="/profileEdit" className={classes.link}>Editar Perfil</Link>
               </Button>
              </FormControl>
            </Grid>

        </Paper>
        </Grid>
      }
    </>
  );
}

export default Profile;