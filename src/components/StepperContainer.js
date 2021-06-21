import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OrderSummary from './OrderSummary';
import PersonalData from './PersonalData';
import Payment from './Payment';
import OrderConfirmation from './OrderConfirmation';
import { CartContext } from '../context/CartContext';
import { SettingsPhoneSharp } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Resumen de la compra', 'Datos personales', 'Pago y Retiro', 'Confirmación'];
}



const initialInfo =  {
  name:'',
  number:'',
  expDate:'',
  cvc:'',
  pickupPlace: '',
};


const StepperContainer = () => {
    const classes = useStyles();
    
    const [activeStep, setActiveStep] = useState(0);
    const [paymentInfo, setPaymentInfo] = useState(initialInfo);
    const [allowNext, setAllowNext] = useState(false);

    const {cart} = useContext(CartContext);
    


    const steps = getSteps();

    const getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return <OrderSummary></OrderSummary>;
        case 1:
          return <PersonalData/>;
        case 2:
          return <Payment paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} setAllowNext={setAllowNext}/>;
        case 3:
          return <OrderConfirmation paymentInfo={paymentInfo}/>;
        default:
          return 'Unknown stepIndex';
      }
    }

    const confirmPurchase = () => {
      const purchase = {
        paymentInfo: paymentInfo,
        cart: cart,
      }
      
      console.log(purchase);
    }

    const handleNext = () => {
        //If purchase has been confirmed
        if(activeStep === steps.length-1) {
          confirmPurchase();
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
    
      const handleReset = () => {
        setActiveStep(0);
      };

    return ( 
        <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography align="center" className={classes.instructions}>¡Su compra ha sido confirmada!</Typography>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              <Typography component={'div'} className={classes.instructions}>{getStepContent(activeStep)}</Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Atrás
                </Button>
                {
                  !allowNext && activeStep === 2 ? <Button disabled variant="contained" color="primary" onClick={handleNext}>Siguiente</Button> :
                  (<Button variant="contained" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Confirmar Compra' : 'Siguiente'}
                  </Button>)
                }        
              </div>
            </div>
          )}
        </div>
      </div>
     );
}

export default StepperContainer;
