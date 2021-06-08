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
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StoreIcon from '@material-ui/icons/Store';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { useHistory } from 'react-router';
import { ChevronLeft, People } from '@material-ui/icons';

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
  let history = useHistory();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawer(open); 
  };

  const clickHandler = (page) => {
    history.push(page);
  }

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
        <ListItem button onClick={() => clickHandler('/')}>
          <ListItemIcon><HomeIcon/></ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>      
        <ListItem button>
          <ListItemIcon><AccountCircleIcon/></ListItemIcon>
          <ListItemText primary="Mi perfil" />
        </ListItem>
        <ListItem button onClick={() => clickHandler('/users')}>
          <ListItemIcon><People/></ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItem>
        <ListItem button onClick={() => clickHandler('/stores')}>
          <ListItemIcon><StoreIcon/></ListItemIcon>
          <ListItemText primary="Tiendas" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><CardGiftcardIcon/></ListItemIcon>
          <ListItemText primary="Mis compras" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => clickHandler('/products/new')}>
          <ListItemIcon><AddBoxIcon/></ListItemIcon>
          <ListItemText primary="Agregar producto" />
        </ListItem>
        <ListItem button onClick={() => clickHandler('/stores/new')}>
          <ListItemIcon><AddBoxIcon/></ListItemIcon>
          <ListItemText primary="Agregar tienda" />
        </ListItem>
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
