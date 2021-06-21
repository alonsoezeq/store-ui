import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      height: '18vh',
    },   
  }));  

const PaymentData = ({paymentInfo, cart}) => {
    const classes = useStyles();

    return ( 
        <Paper className={classes.paper}>
            <Container spacing={2} direction={'column'} >
                <Grid item xs={6}>
                    <Box fontWeight="fontWeightBold">Información de la tarjeta</Box>
                    <Typography>Nombre: {paymentInfo.name}</Typography>
                    <Typography>Número: {paymentInfo.number}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Box fontWeight="fontWeightBold">Lugar de retiro</Box>
                    <Typography>{
                        paymentInfo.pickupPlace === 'store'? "Retira en el local" : "Retiro a domicilio"
                    }
                    </Typography>
                </Grid>
            </Container>
        </Paper>
     );
}
 
export default PaymentData;