import React, { useContext } from 'react';
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
import { useHistory } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { AppContext } from '../AppContext';
import { Chip } from '@material-ui/core';
import categories from '../config/categories.json';
import genders from '../config/genders.json';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  chip: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.5)
  }
}));



const SideMenu = ({drawerToggle, setDrawer}) => {
  const classes = useStyles();
  const history = useHistory();
  const [context, setContext] = useContext(AppContext);

  const navigateTo = (path, title) => {
    let text = path !== '/' ? title : '';
    setContext({...context, title: text});
    history.push(path);
  }

  const firstGroup = [
    { text: "Inicio", icon: <Home />, path: '/' },
    { text: "Mi perfil", icon: <AccountCircle />, path: '/profile', condition: isAuthenticated() },
    { text: "Usuarios", icon: <People />, path: '/users', condition: isAdmin() },
    { text: "Tiendas", icon: <Store />, path: '/stores' },
    { text: "Mis compras", icon: <LocalMall />, path: '/buys', condition: isBuyer() },
    { text: "Ventas", icon: <LocalAtm />, path: '/sells', condition: (isSeller() || isAdmin()) }
  ];

  const secondGroup = [
    { text: "Agregar producto", icon: <AddBox />, path: '/products/add', condition: (isSeller() || isAdmin()) },
    { text: "Agregar tienda", icon: <AddBox />, path: '/stores/add', condition: isAdmin() },
    { text: "Lista de productos", icon: <AddBox />, path: '/products/search', condition: (isSeller() || isAdmin()) },
    { text: "Lista de tiendas", icon: <AddBox />, path: '/stores/search', condition: isAdmin() },
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
            <ListItem button key={path} onClick={() => navigateTo(path, text)}>
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
            <ListItem button key={path} onClick={() => navigateTo(path, text)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))
        }
      </List>
      <Divider />
      {
        genders.map(gender => (
          <Chip
            key={gender}
            label={gender}
            className={classes.chip}
            onClick={() => navigateTo(`/?gender=${gender}`, gender)}
          />
        ))
      }
      <Divider />
      {
        categories.map(category => (
          <Chip
            key={category}
            label={category}
            className={classes.chip}
            onClick={() => navigateTo(`/?category=${category}`, category)}
          />
        ))
      }
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
