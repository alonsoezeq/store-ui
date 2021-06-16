import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SideMenu from './SideMenu';
import { Link } from 'react-router-dom';
import { isAuthenticated, isBuyer, logout } from '../helpers/AuthUtils';
import { Menu, ShoppingCart } from '@material-ui/icons';
import { AppContext } from '../AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none' 
  }
}));

const NavBar = () => {
  const classes = useStyles();
  const [context, setContext] = useContext(AppContext);
    
  const [drawerToggle, setDrawer] = useState(false);

  return ( 
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menú" onClick={() => setDrawer(!drawerToggle)}>
            <Menu />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>Tienda on-line</Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>{context.title}</Link>
          </Typography>
          {
            isBuyer() &&
            <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="carrito">
              <Link to="/cart" className={classes.link}><ShoppingCart /></Link>
            </IconButton>
          }
          {
            !isAuthenticated() &&
            <Button color="inherit">
              <Link to="/login" className={classes.link}>Iniciar sesión</Link>
            </Button>
          }
          {
            !isAuthenticated() &&
            <Button color="inherit">
              <Link to="/register" className={classes.link}>Registrarme</Link>
            </Button>
          }
          {
            isAuthenticated() &&
            <Button color="inherit" onClick={() => logout()}>
              Cerrar sesión
            </Button>
          }
        </Toolbar>
      </AppBar>
      <SideMenu drawerToggle={drawerToggle} setDrawer={setDrawer}/>
    </div>
  );
}
 
export default NavBar;