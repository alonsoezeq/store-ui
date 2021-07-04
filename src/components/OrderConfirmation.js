import { Grid } from '@material-ui/core';
import React from 'react';
import OrderSummary from './OrderSummary';
import PaymentData from './PaymentData';
import PersonalData from './PersonalData';

const OrderConfirmation = ({paymentInfo, cart}) => {
    return ( 
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <OrderSummary paymentInfo={paymentInfo} />
            </Grid>
            <Grid item xs={6}>
                <PersonalData />
            </Grid>
            <Grid item xs={6}>
                <PaymentData paymentInfo={paymentInfo} cart={cart}/>
            </Grid>
        </Grid>
     );
}
 
export default OrderConfirmation;