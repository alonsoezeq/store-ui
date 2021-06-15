import { Box, CircularProgress, Paper, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";
import useStyles from "./ProductDescription/styles";

const Profile = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    loading: true,
    user: null,
    error: null
  });

  let { loading, user, error } = state;

  useEffect(() => {
    fetch(`${config.baseApi}/profile`, {
      headers: {
        ...authHeader()
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => setState({
        loading: false,
        user: data,
        error: null
      }))
    .catch(err => setState({
        loading: false,
        user: null,
        error: err
      }));
  }, []);

  return (
    <>
      {
        loading && <CircularProgress />
      }
      {
        !loading && !error &&
        <Paper className={classes.product} elevation={3}>
          <Typography>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Username:
            </Box>
            {user.username}
          </Typography>
          <Typography>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Fullname:
            </Box>
            {user.fullname}
          </Typography>
          <Typography>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              E-Mail:
            </Box>
            {user.email}
          </Typography>
          <Typography>
            <Box display="inline" fontWeight="fontWeightBold" m={1}>
              Role:
            </Box>
            {user.role}
          </Typography>
          <Typography>
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