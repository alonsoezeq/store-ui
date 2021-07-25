import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3, 2),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "15vh"
  }
}));

const PersonalData = () => {
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
      setContext({ ...context, loading: false, status: 'error', message: 'Ocurrió un error al obtener los datos del perfil.' });
    });
  }, []);

  return (
    <>
      {
        !context.loading && user &&
        <Paper className={classes.paper} elevation={3}>
          <div className={classes.container}>
            <Typography component={'div'} align="center">
              <Box fontWeight="fontWeightBold">Información Personal</Box>
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Nombre completo:
              </Box>
              {user.fullname}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Nombre de usuario:
              </Box>
              {user.username}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Correo electrónico:
              </Box>
              {user.email}
            </Typography>
            <Typography component={'div'}>
              <Box display="inline" fontWeight="fontWeightBold" m={1}>
                Domicilio:
              </Box>
              {user.address || ''}
            </Typography>
          </div>
        </Paper>
      }
    </>
  );
}

export default PersonalData;