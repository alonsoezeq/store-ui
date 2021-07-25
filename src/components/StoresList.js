import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, fade, Grid, IconButton, makeStyles, Typography, Switch } from '@material-ui/core';
import { authHeader} from '../helpers/AuthUtils';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import config from '../config/config';
import { AppContext } from '../AppContext';
import { useHistory } from 'react-router-dom';
import { Edit } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    select: {
      width: "11.5vw",
    },
    table: {
      minWidth: 650,
    },
    search: {
      marginBottom: '2vw',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'black',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));



const StoresList = ({stores, setStores}) => {

    const classes = useStyles();
    const [ context, setContext ] = useContext(AppContext);
    const [filter, setFilter] = useState('');
    const [filteredStores, setFilteredStores] = useState([]);

    const history = useHistory();

    const navigateTo = (path, title) => {
        let text = path !== '/' ? title : '';
        setContext({...context, title: text});
        history.push(path);
    }

    useEffect(() => {
      let auxStores
      if(filter === '') {
        auxStores = stores;
      } else {
        auxStores = stores.filter( store => store.id.toString() === filter);
      }
      setFilteredStores(auxStores);
    }, [filter, stores]);

    const handleFilter = (e) => {
        setFilter(e.target.value);
      }
  
    const resetFilter = () => {
        setFilter('');
    }

    const changeState = (id, store) => {
        fetch(`${config.baseApi}/stores/${id}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            ...authHeader()
            },
            body: JSON.stringify(store)
        })
        .then((res) => res.ok ? res : Promise.reject(res.statusText))
        .then((data) => {
            if(store.active) {
                setContext({ ...context, status: 'success', message: 'Se dio de alta la tienda' });
            } else {
                setContext({ ...context, status: 'success', message: 'Se dio de baja la tienda' });
            }
            
        })
        .catch(err => {
            setContext({ ...context, status: 'error', message: err });
        });
    }

    const handleStateChange = (id, store) => {
        let index = filteredStores.indexOf(store);
        let auxArray = filteredStores.slice();

        if (index !== -1) {
            if(store.active) {
                store.active = false;
            } else {
                store.active = true;
            }
            
            auxArray[index] = store;
        }
        changeState(id, store);
        setFilteredStores(auxArray)
    }

    return ( 
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div> 
                <InputBase
                    placeholder={"Id tienda"}
                    classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleFilter}
                    value={filter}
                />
                <Button size="small" style={{marginLeft:'0.5rem'}} variant="contained" color="primary" onClick={resetFilter}>Limpiar</Button>
                </div>
            </Grid>
            { filteredStores.length > 0 &&     
            <Grid item xs={12}>
            <Paper component={'div'}>    
                <TableContainer >
                    <Table className={classes.table} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Id Tienda</TableCell>
                                <TableCell align="center">Nombre</TableCell>
                                <TableCell align="center">Dirección</TableCell>
                                <TableCell align="center">Editar</TableCell>
                                <TableCell align="center">Activo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                        filteredStores?.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell align="center">{store.id}</TableCell>
                                <TableCell align="center">{store.name}</TableCell>
                                <TableCell align="center">{store.address}</TableCell>
                                <TableCell align="center">
                                    <IconButton aria-label="edit" onClick={() => navigateTo(`/stores/${store.id}/edit`, 'Editar tienda')}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <Switch
                                    checked={store.active}
                                    onChange={() => handleStateChange(store.id, store)}
                                    name="active"
                                    color="primary"
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                        }
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
                </Grid>
                }
                {
                filteredStores.length === 0 && 
                <Grid item xs={12}> 
                    <Typography align="center">No se encontraron resultados</Typography>
                </Grid>
                }
        </ Grid>
    );
}
 
export default StoresList;