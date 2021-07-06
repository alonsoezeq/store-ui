import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, fade, FormControl, Grid, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { authHeader, isBuyer } from '../helpers/AuthUtils';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import config from '../config/config';
import { AppContext } from '../AppContext';
import { useHistory } from 'react-router-dom';

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



const ProductList = ({products, setProducts}) => {

    const classes = useStyles();
    const [ context, setContext ] = useContext(AppContext);
    const [filter, setFilter] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    console.log(products)

    const history = useHistory();

    const navigateTo = (path, title) => {
        let text = path !== '/' ? title : '';
        setContext({...context, title: text});
        history.push(path);
    }

    useEffect(() => {
      let auxProducts
      if(filter === '') {
        auxProducts = products;
      } else {
        auxProducts = products.filter( product => product.id.toString() === filter);
      }
      //console.log(auxProducts);
      setFilteredProducts(auxProducts);
    }, [filter, products]);

    const handleFilter = (e) => {
        setFilter(e.target.value);
      }
  
    const resetFilter = () => {
        setFilter('');
    }

    const changeState = (id, product) => {
        fetch(`${config.baseApi}/products/${id}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            ...authHeader()
            },
            body: JSON.stringify(product)
        })
        .then((res) => res.ok ? res : Promise.reject(res.statusText))
        .then((data) => {
            if(product.active) {
                setContext({ ...context, status: 'success', message: 'Se dio de alta el producto' });
            } else {
                setContext({ ...context, status: 'success', message: 'Se dio de baja el producto' });
            }
            
        })
        .catch(err => {
            setContext({ ...context, status: 'error', message: err });
        });
    }

    const handleDelete = (id, product) => {
        let index = products.indexOf(product);
        let auxArray = products.slice();

        if (index !== -1) {
            if(product.active) {
                product.active = false;
            } else {
                product.active = true;
            }
            
            auxArray[index] = product;
        }
        
        changeState(id, product);
        setProducts(products)
    }

    const handleEdit = (id) => {
        //Redirect to edit page
    }

    return ( 
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div> 
                <InputBase
                    placeholder={"Id producto"}
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
            { filteredProducts.length > 0 &&     
            <Grid item xs={12}>
            <Paper component={'div'}>    
                <TableContainer >
                    <Table className={classes.table} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Id Producto</TableCell>
                                <TableCell align="center">Nombre</TableCell>
                                <TableCell align="center">Descripción</TableCell>
                                <TableCell align="center">Estado</TableCell>
                                <TableCell align="center">Editar</TableCell>
                                <TableCell align="center">Dar de baja</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                        filteredProducts?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell align="center">{product.id}</TableCell>
                                <TableCell align="center">{product.title}</TableCell>
                                <TableCell align="center" >{product.description}</TableCell>
                                <TableCell align="center" >{product.active? "Activo" : "Dado de baja"}</TableCell>
                                <TableCell align="right"><Button size="small" variant="contained" color="primary" onClick={() => navigateTo(`/products/${product.id}/edit`, 'Editar producto')}>Editar</Button></TableCell>
                                <TableCell align="right">
                                    { product.active?
                                        <Button size="small" variant="contained" color="secondary" onClick={() => handleDelete(product.id, product)}>Dar de baja</Button>:
                                        <Button size="small" variant="contained" color="primary" onClick={() => handleDelete(product.id, product)}>Dar de alta</Button>
                                    }
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
                filteredProducts.length === 0 && 
                <Grid item xs={12}> 
                    <Typography align="center">No se encontraron resultados</Typography>
                </Grid>
                }
        </ Grid>
    );
}
 
export default ProductList;