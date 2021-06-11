import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { AddBox, ChevronLeft, Home, LocalAtm, LocalMall, People, Store } from '@material-ui/icons';
import { isAdmin, isAuthenticated, isBuyer, isSeller } from '../helpers/AuthUtils';
import { Link } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});



const SideMenu = ({drawerToggle, setDrawer}) => {
  const classes = useStyles();

  const firstGroup = [
    { text: "Inicio", icon: <Home />, path: '/' },
    { text: "Mi perfil", icon: <AccountCircle />, path: '/profile', condition: isAuthenticated() },
    { text: "Usuarios", icon: <People />, path: '/users', condition: isAdmin() },
    { text: "Tiendas", icon: <Store />, path: '/stores' },
    { text: "Mis compras", icon: <LocalMall />, path: '/buys', condition: isBuyer() },
    { text: "Ventas", icon: <LocalAtm />, path: '/sells', condition: (isSeller() || isAdmin()) }
  ];

  const secondGroup = [
    { text: "Agregar producto", icon: <AddBox />, path: '/products/new', condition: (isSeller() || isAdmin()) },
    { text: "Agregar tienda", icon: <AddBox />, path: '/stores/new', condition: isAdmin() },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawer(open); 
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <IconButton>
        <ChevronLeft />
      </IconButton>
      <Divider />
      <List>
        {
          firstGroup.map(({text, icon, path, condition}) => (
            (condition === undefined || condition === true) &&
            <ListItem button key={path} component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))
        }    
      </List>
      <Divider />
      <List>
        {
          secondGroup.map(({text, icon, path, condition}) => (
            (condition === undefined || condition === true) &&
            <ListItem button key={path} component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))
        }
      </List>
    </div>
  );

  return (
    <div>
      <Drawer anchor='left' open={drawerToggle} onClose={toggleDrawer(false)}>
        { list('left') }
      </Drawer>
    </div>
  );
}


export default SideMenu;
