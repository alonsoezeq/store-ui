import { CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import UserList from "../components/UserList";
import config from '../config/config';
import { authHeader } from "../helpers/AuthUtils";

const Users = () => {
  const [state, setState] = useState({
    loading: true,
    users: [],
    error: null
  });

  const {loading, users, error} = state;

  useEffect(() => {
    fetch(`${config.baseApi}/users`, {
      headers: {
        ...authHeader()
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => setState({
        loading: false,
        users: data,
        error: null
      }))
    .catch(err => setState({
        loading: false,
        users: [],
        error: err
      }));
  }, []);

  const handleSnackbarClose = () => {
    setState({
      ...state,
      error: null
    });
  }

  return (   
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleSnackbarClose}>{error?.toString()}</Alert>
      </Snackbar>
      { loading ? <CircularProgress /> : <UserList users={users} /> }
    </>
  );
}

export default Users;