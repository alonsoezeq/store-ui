import { makeStyles, TableRow } from "@material-ui/core";
import { FormControl, MenuItem, Paper, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import config from '../config/config';
import { authHeader } from "../helpers/AuthUtils";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  }
});

const Users = () => {
  const classes = useStyles();
  const [ context, setContext ] = useContext(AppContext);
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/users`, {
      headers: {
        ...authHeader()
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(data => {
      setUsers(data);
      setContext({ ...context, loading: false });
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  }, []);

  const updateUser = (id, delta) => {
    setContext({ ...context, loading: true });

    fetch(`${config.baseApi}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(delta)
    })
    .then(res => res.ok ? res : Promise.reject(res.statusText))
    .then(() => {
      setUsers(users.map(user => user.id === id ? {...user, ...delta} : user));
      setContext({
        ...context,
        loading: false,
        status: 'success',
        message: 'Saved'
      })
    })
    .catch(err => {
      setContext({ ...context, loading: false, status: 'error', message: err });
    });
  };

  const handleRoleChange = (id) => (event) => {
    updateUser(id, {[event.target.name]: event.target.value});
  };
  
  const handleStatusChange = (id) => (event) => {
    updateUser(id, {[event.target.name]: event.target.checked});
  };

  return (   
    <>
      { !context.loading &&
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
                  <TableCell>{new Date(u.registration).toLocaleDateString()}</TableCell>
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