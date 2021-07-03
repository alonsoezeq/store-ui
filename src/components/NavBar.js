import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Badge, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import SideMenu from './SideMenu';
import { Link } from 'react-router-dom';
import { isAuthenticated, isBuyer, logout } from '../helpers/AuthUtils';
import { AccountCircle, Menu as MenuIcon, ShoppingCart } from '@material-ui/icons';
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
  const [ context, setContext ] = useContext(AppContext);
    
  const [ drawerToggle, setDrawer ] = useState(false);
  const [ anchorEl, setAnchorEl ] = useState(false); 

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null)
  };

  const handleCloseSession = () => {
    handleMenuClose();
    logout();
  }

  return ( 
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menú" onClick={() => setDrawer(!drawerToggle)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link} onClick={() => setContext({ ...context, title: ''})}>Tienda on-line</Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>{context.title}</Link>
          </Typography>
          {
            isBuyer() &&
            <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="carrito">
              <Link to="/cart" className={classes.link}>
                <Badge badgeContent={context.cartitems.length} color="secondary">
                  <ShoppingCart />
                </Badge>
              </Link>
            </IconButton>
          }
          {
            isAuthenticated() &&
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          }
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={!!anchorEl}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Link to="/profile" className={classes.link}>Mi perfil</Link>
            </MenuItem>
            <MenuItem onClick={handleCloseSession}>Cerrar sesión</MenuItem>
          </Menu>
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
        </Toolbar>
      </AppBar>
      <SideMenu drawerToggle={drawerToggle} setDrawer={setDrawer}/>
    </div>
  );
}
 
export default NavBar;