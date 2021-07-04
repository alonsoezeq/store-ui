import { Box, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(3, 2),
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      height: "15vh"
    }   
  }));  

const PaymentData = ({paymentInfo, cart}) => {
    const classes = useStyles();

    return ( 
        <>
            <Paper className={classes.paper} elevation={3}>
              <div className={classes.container}>            
              <Typography component={'div'} align="center">
                <Box fontWeight="fontWeightBold">Información de la tarjeta</Box>
              </Typography>
              <Typography component={'div'}>
                <Box display="inline" fontWeight="fontWeightBold" m={1}>
                  Nombre:
                </Box>
                {paymentInfo.name}
              </Typography>
              <Typography component={'div'}>
                <Box display="inline" fontWeight="fontWeightBold" m={1}>
                  N°:
                </Box>
                {paymentInfo.number}
              </Typography>
              <Typography component={'div'}  align="center">
                <Box fontWeight="fontWeightBold">Información de Envío</Box>
              </Typography>
              <Typography component={'div'}>
                <Box display="inline" fontWeight="fontWeightBold" m={1}>
                  Lugar de retiro:
                </Box>
                {
                    paymentInfo.pickupPlace === 'store'? "Retira en el local" : "Retiro a domicilio"
                }
              </Typography>
              </div>
            </Paper>
        </>
     );
}
 
export default PaymentData;