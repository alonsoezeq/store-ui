import { Button, FormControl, Grid, makeStyles, Paper, TextField, Typography } from "@material-ui/core"
import { useContext, useEffect, useState } from "react";
import config from "../config/config";
import { authHeader } from "../helpers/AuthUtils";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: "2rem",
    },
    inputNumber: {
      width: '10rem'
    },
  }));


const StockControl = () => {
   
    const { id } = useParams();
    const classes = useStyles();
    const history = useHistory();
    const [ context, setContext ] = useContext(AppContext);
    const [ quantity, setQuantity] = useState(0);
    const [product, setProduct] = useState(null);


    useEffect(() => {
        setContext({ ...context, loading: true });
    
        fetch(`${config.baseApi}/products/${id}`)
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
        .then(data => {
          setProduct(data);
          setContext({ ...context, loading: false });
        })
        .catch(err => {
          setContext({ ...context, loading: false, status: 'error', message: 'Error al traer los productos.' });
        });
      }, []);
    
    const handleNumberChange = (event) => {
        setQuantity(Number(event.target.value));
    }

    const addQuantity = () => {
        let result = product.quantity + quantity;
        setProduct({...product, quantity: result});
    }

    const substractQuantity = () => {
        let result = product.quantity - quantity;

        if(result < 0){
            result = 0;
        }
        setProduct({...product, quantity: result});
    }

    const handleCancel = () => {
        history.push('/products/search');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    
        setContext({ ...context, loading: true });
        fetch(`${config.baseApi}/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(product),
          headers: {
            'Content-Type': 'application/json',
            ...authHeader()
          }
        })
        .then(res => res.ok ? res : Promise.reject(res.statusText))
        .then(() => {
          setContext({
            ...context,
            loading: false,
            status: 'success',
            message: 'Stock modificado'
          });
          history.push('/products/search');
        })
        .catch(err => {
          setContext({ ...context, loading: false, status: 'error', message: 'Error al modificar el stock.' });
        });
      }
    
    return ( 
        <>
      {
        !context.loading && product &&
        <Grid container justify="center" alignContent="center">
            <Paper className={classes.paper} elevation={3} style={{minWidth:"40vw"}}>
                    <form autoComplete="off" className={classes.container} onSubmit={handleSubmit}>
                        <Grid container direction="column" spacing={6}>
                            <Grid item xs={12}>
                                <Typography variant="h3" align="center">Editar stock</Typography>
                            </Grid>   
                            <Grid item xs={12}>
                                    <Typography variant="h6" align="center">Cantidad Actual: {product.quantity}</Typography>
                            </Grid>    
                            <Grid item xs={12}>
                                <Grid container direction="row">
                                    <Grid item xs={7}>
                                        <FormControl required >
                                            <TextField fullWidth id="quantity" name="quantity" type="number" inputProps={{ min:"0",inputMode:"numeric"}} value={quantity} onChange={handleNumberChange} />
                                        </FormControl>
                                    </Grid>  
                                    <Grid item xs={5}>
                                        <Grid container justify="space-around">
                                            <Button id="add" name="add" variant="contained" color="primary" disabled={context.loading} onClick={addQuantity}>
                                            +
                                            </Button>                                   
                                            <Button id="substract" name="substract" variant="contained" color="secondary" disabled={context.loading} onClick={substractQuantity}>
                                            -
                                            </Button>
                                        </Grid>                                    
                                    </Grid>          
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="row"justify="space-between">
                                    <Button id="cancel" name="cancel" variant="contained" color="secondary" disabled={context.loading} onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                    <FormControl >
                                        <Button id="submit" name="submit" type="submit" variant="contained" color="primary" disabled={context.loading}>
                                        Guardar
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
            </Paper>
        </Grid>
      }
    </>
     );
}
 
export default StockControl;