import { Button, Grid, makeStyles, Paper } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';


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
    }
  }));  

const Payment = ({paymentInfo, setPaymentInfo, setAllowNext}) => {
    const classes = useStyles();
    const [value, setValue] = useState(new Date());
    const [cardNumberIsValid, setCardNumberIsValid] = useState(true);
    const [cardNameIsValid, setCardNameIsValid] = useState(true);
    const [cardCVCIsValid, setCardCVCIsValid] = useState(true);

    useEffect(() => {
        if(paymentInfo.pickupPlace === ''){
            paymentInfo.pickupPlace = "store";
        }
        if(paymentInfo) {
            paymentInfo.cvc = '';
            setPaymentInfo({...paymentInfo});
            setAllowNext(false);
        }
    }, []);

    const validateWhiteSpaces = () => {
        paymentInfo.number.trim() === '' ? setCardNumberIsValid(false) : setCardNumberIsValid(true) ;
        paymentInfo.cvc.trim() === '' ? setCardCVCIsValid(false) : setCardCVCIsValid(true);
        paymentInfo.name.trim() === '' ?  setCardNameIsValid(false) : setCardNameIsValid(true);
    }

    const addSpace = (e) => {      
        e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    const handleChange = (e) => {
        setPaymentInfo({...paymentInfo, [e.target.name]:e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        paymentInfo.expDate = value;
        
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

        console.log(paymentInfo);     
    }

    return ( 
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={3} >
                <Grid item xs={12} >
                    <Paper>
                    <form className={classes.form} onSubmit={handleSubmit}>
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
                                    <TextField error className={classes.textField} name="cvc" label="CVC"  type="text" variant="outlined" inputProps={{maxLength: 3, inputMode:"numeric"}} onChange={handleChange} helperText="Campo incompleto"/>
                                }
                                
                            </Grid>
                        </Grid>
                        {
                            cardNameIsValid ? <TextField name="name" defaultValue={paymentInfo.name} label="Nombre tarjeta"  variant="outlined" onChange={handleChange} /> : 
                            <TextField error name="name" defaultValue={paymentInfo.number} label="Nombre tarjeta" variant="outlined" onChange={handleChange} helperText="Campo incompleto"/>
                        }              
                        <Typography>Retiro del producto</Typography>
                        <FormControl className={classes.formControl}>
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
                        <Button className={classes.buttonInput} type="submit" variant="contained" color="primary">Confirmar</Button>   
                    </form> 
                    </Paper>                    
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
     );
}
 
export default Payment;