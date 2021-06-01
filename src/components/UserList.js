import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const UserList = ({users}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">E-Mail</TableCell>
            <TableCell align="right">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((u) => (
            <TableRow key={u.id}>
              <TableCell component="th" scope="row">{u.username}</TableCell>
              <TableCell align="right">{u.email}</TableCell>
              <TableCell align="right">{u.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserList;