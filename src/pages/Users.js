import { makeStyles, TableRow } from "@material-ui/core";
import { CircularProgress, FormControl, MenuItem, Paper, Select, Snackbar, Switch, Table, TableBody, TableCell, TableContainer, TableHead } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import config from '../config/config';
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  }
});


const Users = () => {
  const classes = useStyles();

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

  const updateUser = (id, delta) => {
    setState({
      loading: true,
      users: state.users,
      error: null
    });

    fetch(`${config.baseApi}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(delta)
    })
    .then(res => {
      if (res.ok) {
        setState({
          loading: false,
          users: state.users.map(user => user.id === id ? {...user, ...delta} : user),
          error: null
        });
      } else {
        Promise.reject(res);
      }
    })
    .catch(err => setState({
        loading: false,
        users: state.users,
        error: err
      }));
  };

  const handleRoleChange = (id) => (event) => {
    console.log(event);
    updateUser(id, {[event.target.name]: event.target.value});
  };
  
  const handleStatusChange = (id) => (event) => {
    console.log(event);
    updateUser(id, {[event.target.name]: event.target.checked});
  };

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
      { loading && <CircularProgress /> } 
      { !loading &&
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>E-Mail</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Registered</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.fullname}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <FormControl>
                    <Select
                      name="role"
                      value={u.role}
                      onChange={handleRoleChange(u.id)}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="buyer">Buyer</MenuItem>
                      <MenuItem value="seller">Seller</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{u.registration}</TableCell>
                <TableCell>
                  <Switch
                    checked={u.active}
                    onChange={handleStatusChange(u.id)}
                    name="active"
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      }
    </>
  );
}

export default Users;