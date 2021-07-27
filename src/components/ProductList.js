import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, fade, Grid, IconButton, makeStyles, MenuItem, Select, Switch, Typography, ListItemIcon } from '@material-ui/core';
import { authHeader} from '../helpers/AuthUtils';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import config from '../config/config';
import { AppContext } from '../AppContext';
import { useHistory } from 'react-router-dom';
import priorities from '../config/priorities.json';
import { Edit } from '@material-ui/icons';
import colors from "../config/colors.json";
import { FiberManualRecord } from "@material-ui/icons";

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
            setContext({ ...context, status: 'error', message: 'Ocurrió un error al activar/desactivar el producto.' });
        });
    }

    const changeProduct = (id, product, message) => {
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
            setContext({ ...context, status: 'success', message: message });            
        })
        .catch(err => {
            setContext({ ...context, status: 'error', message: 'Ocurrió un error al modificar el producto.' });
        });
    }

    const handleStateChange = (id, product) => {
        let index = filteredProducts.indexOf(product);
        let auxArray = filteredProducts.slice();

        if (index !== -1) {
            if(product.active) {
                product.active = false;
            } else {
                product.active = true;
            }
            
            auxArray[index] = product;
        }
        
        changeState(id, product);
        setFilteredProducts(auxArray);
    }

    
  const handleQuantityChange = (product, value) => {
    let index = filteredProducts.indexOf(product);
    let auxArray = filteredProducts.slice();

    if (index !== -1) {
        if(value > 0) {
            product.quantity = value;
        } else {
            product.quantity = 0;
        }
        
        
        auxArray[index] = product;
    }

    changeProduct(product.id, product, "Se modificó el stock");
    setFilteredProducts(auxArray);
  }

  const handleChange = (product, value) => {
    let index = filteredProducts.indexOf(product);
    let auxArray = filteredProducts.slice();

    if (index !== -1) {
        product.priority = value;
        auxArray[index] = product;
    }

    changeProduct(product.id, product, "Se modificó la prioridad");
    setFilteredProducts(auxArray);
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
                                <TableCell align="center">Articulo</TableCell>
                                <TableCell align="center">Color</TableCell>
                                <TableCell align="center">Stock</TableCell>
                                <TableCell align="center">Prioridad</TableCell>
                                <TableCell align="center">Editar</TableCell>
                                <TableCell align="center">Activo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                        filteredProducts?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell align="center">{product.id}</TableCell>
                                <TableCell align="center">{product.title}</TableCell>
                                <TableCell align="center" >{product.description}</TableCell>
                                <TableCell align="center" >{product.article}</TableCell>
                                <TableCell align="center" >
                                {
                                  Object.keys(colors).filter(rgb => rgb === product.color).map(rgb => 
                                    <MenuItem align="center" key={rgb} value={rgb}>
                                      <ListItemIcon style={{color: rgb}}>
                                        <FiberManualRecord align="center" fontSize="small" />
                                      </ListItemIcon>
                                      {colors[rgb]}
                                    </MenuItem>
                                  )
                                }
                                </TableCell>
                                <TableCell align="center">
                                    <input type="number" min="1" step="1" value={product.quantity} onChange={(e) => handleQuantityChange(product, e.target.value)} />  
                                </TableCell>
                                <TableCell align="center">
                                <Select id="priority" name="priority" className={classes.inputSelect} value={product.priority} onChange={(e) => handleChange(product, e.target.value)}>
                                    {
                                        priorities.map((label, index) => <MenuItem key={index} value={index}>{label}</MenuItem>)
                                    }
                                </Select>  
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton aria-label="edit" onClick={() => navigateTo(`/products/${product.id}/edit`, 'Editar producto')}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <Switch
                                        checked={product.active}
                                        onChange={() => handleStateChange(product.id, product)}
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
                filteredProducts.length === 0 && 
                <Grid item xs={12}> 
                    <Typography align="center">No se encontraron resultados</Typography>
                </Grid>
                }
        </ Grid>
    );
}
 
export default ProductList;