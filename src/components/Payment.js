import { Button, Grid, makeStyles, Paper, Input, InputLabel } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { authHeader } from "../helpers/AuthUtils";
import config from "../config/config";
import { AppContext } from "../AppContext";
import provinces from "../config/provinces.json";

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: '2vh 2vw 2vh 2vw',
        height: '55vh',

    },
    formControl: {
        margin: theme.spacing(1),
        width: '25vw',
        alignSelf: 'flex-start',
      },
    textField: {
        width: '100%',
    },
    buttonInput: {
        alignSelf: 'flex-end'
    },
    inputText: {
        width: "25vw",
      }
  }));  


const Payment = ({paymentInfo, setPaymentInfo, setAllowNext}) => {
    const classes = useStyles();
    const [value, setValue] = useState(new Date());
    const [cardNumberIsValid, setCardNumberIsValid] = useState(true);
    const [cardNameIsValid, setCardNameIsValid] = useState(true);
    const [cardCVCIsValid, setCardCVCIsValid] = useState(true);
    const [user, setUser ] = useState(null);
    const [stores, setStores ] = useState([]);
    const [context, setContext ] = useContext(AppContext);

    useEffect(() => {
        if(paymentInfo) {
            paymentInfo.cvc = '';
            setPaymentInfo({...paymentInfo});
            setAllowNext(false);
        }
        if(paymentInfo.pickupPlace === ''){
            paymentInfo.pickupPlace = "store";
        }
        if(paymentInfo.pickupStore === '' || paymentInfo.pickupStore === undefined){
            paymentInfo.pickupStore = "Tienda Palermo";
        }
        const traerPerfil = async () =>
        {

        await fetch(`${config.baseApi}/profile`, {
            headers: {
              ...authHeader()
            }
          }).then(res => res.ok ? res.json() : Promise.reject(res.statusText))
          .then(data => {
            setUser(data);
            setContext({ ...context, loading: false });
            setPaymentInfo({...paymentInfo, shippingProvince:data?.province });
            setPaymentInfo({...paymentInfo, address:data?.address });
            paymentInfo.shippingProvince = data?.province;
            paymentInfo.address = data?.address;
          })
          .catch(err => {
            setContext({ ...context, loading: false, status: 'error', message: "Lo sentimos, hubo un problema!" });
          });
        }
        
        const traerTiendas = async () => 
        {
        fetch(`${config.baseApi}/stores?active=1`)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(data => {
            setStores(data);
            setContext({ ...context, loading: false});
            setPaymentInfo({...paymentInfo, pickupStore:data?.name });
            console.log(data[0].name);
            paymentInfo.pickupStore = data[0].name;
          })
            .catch(err => {
            setContext({ ...context, loading: false, status: 'error', message: "Lo sentimos, hubo un problema!" });
          });

        }
        traerTiendas();
        traerPerfil();

        console.log(paymentInfo);
    }, []);

    const validateWhiteSpaces = () => {
        paymentInfo.number.trim() === '' ? setCardNumberIsValid(false) : setCardNumberIsValid(true) ;
        paymentInfo.cvc.trim() === '' ? setCardCVCIsValid(false) : setCardCVCIsValid(true);
        paymentInfo.name.trim() === '' ?  setCardNameIsValid(false) : setCardNameIsValid(true);
    }

    const addSpace = (e) => {      
        e.target.value = e.target.value.replace(/[^\d0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    const handleChange = (e) => {
        if(e.target.name !== 'name' && e.target.name !== 'pickupPlace' && e.target.name !== 'pickupStore' && e.target.name !== 'shippingProvince' && e.target.name !== 'address') {e.target.value = e.target.value.replace(/[^\d0-9]/g, '')};
        setPaymentInfo({...paymentInfo, [e.target.name]:e.target.value});
        
    }

    const parseProvince = (province) => {
        return provinces[province];
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        paymentInfo.expDate = value;
        
        console.log(paymentInfo);
        //Validate form
        if(paymentInfo.name.trim() === '' || paymentInfo.number.trim() === '' ||
        paymentInfo.cvc.trim() === ''){
            validateWhiteSpaces();
            setAllowNext(false);
            return;
        } else {
            validateWhiteSpaces();
            setAllowNext(true);
        }
        if((paymentInfo.pickupStore === '' || paymentInfo.pickupStore === undefined) && paymentInfo.pickupPlace === 'store'){
            setContext({ ...context, 
                status: 'error', 
                message: "Debe seleccionar una tienda donde retirar." 
            });
            validateWhiteSpaces();
            setAllowNext(false);
            return;
        }

        if(paymentInfo.pickupPlace === 'home'){
            paymentInfo.shippingPrice = parseProvince(paymentInfo.shippingProvince);
        }else{
            paymentInfo.address = stores?.find(function (el){
                return el.name === paymentInfo.pickupStore;
            }).address;
            paymentInfo.shippingPrice = 0;
        }  
    }

    return ( 
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={3} >
                <Grid item xs={12} >
                    <Paper>
                    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
                        <Typography>Información de la tarjeta</Typography>
                            {
                                cardNumberIsValid? <TextField  name="number" defaultValue={paymentInfo.number} label="Número tarjeta" type="tel" inputProps={{maxLength: 19, inputMode: "numeric"}} variant="outlined" onChange={handleChange} onKeyDown={addSpace}/> :
                                <TextField error name="number" defaultValue={paymentInfo.number} label="Número tarjeta"  type="text" inputProps={{maxLength: 19, inputMode:"numeric"}} variant="outlined" onChange={handleChange} onKeyPress={addSpace} helperText="Campo incompleto"/>
                            }                
                            <Grid container spacing={2}>
                                <Grid item xs={6} >
                                <DatePicker className={classes.textField}
                                views={['month', 'year']}
                                label="Vencimiento"
                                minDate={new Date()}
                                value={value}
                                format="MM/yy"
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}                                   
                                inputVariant='outlined'
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {
                                    cardCVCIsValid ? <TextField  className={classes.textField} name="cvc" label="CVC"  type="text" variant="outlined"  inputProps={{maxLength: 3, inputMode: "numeric"}} onChange={handleChange}/> :
                                    <TextField error className={classes.textField} name="cvc" label="CVC"  type="text"  variant="outlined" inputProps={{maxLength: 3, inputMode:"numeric"}} onChange={handleChange} helperText="Campo incompleto"/>
                                }
                                
                            </Grid>
                        </Grid>
                        {
                            cardNameIsValid ? <TextField name="name" defaultValue={paymentInfo.name} label="Nombre tarjeta"  variant="outlined" onChange={handleChange} /> : 
                            <TextField error name="name" defaultValue={paymentInfo.number} label="Nombre tarjeta" variant="outlined" onChange={handleChange} helperText="Campo incompleto"/>
                        }    
                        <Grid  container spacing={2}>  
                        <Grid item xs={6}>        
                        <Typography>Retiro del producto</Typography>
                        <FormControl required className={classes.formControl}>
                            <InputLabel id="pickup-place">Retiro del producto</InputLabel>
                            <Select name='pickupPlace'
                            labelId="pickup-place"
                            id="pickup-select"
                            onChange={handleChange}
                            value={paymentInfo.pickupPlace}
                            >
                            <MenuItem value={"store"}>Local</MenuItem>
                            <MenuItem value={"home"}>Envío a Domicilio</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        {paymentInfo.pickupPlace === "store" ?
                        <Grid item xs={6}>
                        <Typography>Seleccionar Local de Retiro</Typography>
                        {
                            paymentInfo.pickupPlace === "store" ?
                        <FormControl required className={classes.root}>
                            <InputLabel htmlFor="pickupStore"></InputLabel>
                            <Select name='pickupStore' id="pickupStore" className={classes.inputText} onChange={handleChange} value={paymentInfo.pickupStore}>
                            {stores.map(store => <MenuItem key={store.id} value={store.name}>{store.name}</MenuItem>)}  
                            </Select>
                        </FormControl>
                            : ""
                        }
                        </Grid>
                        :''}
                        </Grid>
                        {
                            paymentInfo.pickupPlace === "home" ?
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <Grid item xs={12}>
                            <InputLabel htmlFor="address">Dirección</InputLabel>
                            <FormControl required className={classes.root}>
                                <Input id="address" name="address" type="text" className={classes.inputText} value={paymentInfo.address} onChange={handleChange} />
                            </FormControl>      
                            </Grid>                      
                            </Grid>
                            <Grid item xs={6}>
                            <InputLabel htmlFor="shippingProvince">Provincia</InputLabel>
                            <FormControl required className={classes.root}>
                            <Select id="shippingProvince" name="shippingProvince" className={classes.inputText} value={paymentInfo.shippingProvince} onChange={handleChange}>
                            {
                                Object.keys(provinces).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)
                            }
                            </Select>
                            </FormControl>
                            </Grid>
                            {
                                paymentInfo.pickupPlace === "home"? <InputLabel> El producto se enviará a {paymentInfo.address} , con un costo de $ {parseProvince(paymentInfo.shippingProvince)} </InputLabel>  : <InputLabel>Costo de envio: $0</InputLabel>
                            }
                        </Grid>
                        :''}
                        <Button className={classes.buttonInput} type="submit" variant="contained" color="primary">Confirmar</Button>   
                    </form> 
                    </Paper>                    
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
     );
}
 
export default Payment;