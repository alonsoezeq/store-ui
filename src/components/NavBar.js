import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SideMenu from './SideMenu';
import { Link } from 'react-router-dom';

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
  }));

const NavBar = () => {
    const classes = useStyles();
    
    const [drawerToggle, setDrawer] = useState(false);

    return ( 
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menú" onClick={() => setDrawer(!drawerToggle)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Tienda on-line</Link>
                    </Typography>
                    <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="carrito">
                        <ShoppingCartIcon />
                    </IconButton>
                    <Button color="inherit">Iniciar sesión</Button>
                </Toolbar>
            </AppBar>
            <SideMenu drawerToggle={drawerToggle} setDrawer={setDrawer}/>
        </div>
     );
}
 
export default NavBar;