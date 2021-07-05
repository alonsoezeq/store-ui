import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3, 2),
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
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, []);

  return (
    <>
      {
        !context.loading && user &&
        <Paper className={classes.paper} elevation={3}>
          <Typography component={'div'}>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Username:
            </Box>
            {user.username}
          </Typography>
          <Typography component={'div'}>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Fullname:
            </Box>
            {user.fullname}
          </Typography>
          <Typography component={'div'}>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              E-Mail:
            </Box>
            {user.email}
          </Typography>
          {user.role === 'admin' &&
          <Typography component={'div'}>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Role:
            </Box>
            {user.role}
          </Typography>
          }
          <Typography component={'div'}>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Registration:
            </Box>
            {new Date(user.registration).toLocaleDateString()}
          </Typography>
        </Paper>
      }
    </>
  );
}

export default Profile;