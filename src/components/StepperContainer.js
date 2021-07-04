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
import { AppContext } from '../AppContext';
import { authHeader } from '../helpers/AuthUtils';
import { Link } from 'react-router-dom';
import config from '../config/config';
import { Container, Grid } from '@material-ui/core';


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
  link: {
    color: 'inherit',
    textDecoration: 'none' 
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: "70vh",
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40vh',
  }
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
    const [ context, setContext ] = useContext(AppContext);
    


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
        cart: context.cartitems,
      }
      
      console.log(purchase);

      fetch(`${config.baseApi}/cart/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      })
      .then((res) => res.ok ? res : Promise.reject(res.statusText))
      .then((data) => {
        setContext({
          ...context,
          cartitems: [],
          status: 'success',
          message: 'Compra confirmada'
        });      
      })
      .catch(err => {
        setContext({ ...context, status: 'error', message: err });
      });
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
          {activeStep === steps.length ? (
            <div className={classes.container}>    
              <div className={classes.message}>
                <Typography align="center" variant="h4" className={classes.instructions}>¡Su compra ha sido confirmada!</Typography>
              </div>
              <div className={classes.buttons}>
                <Button variant="contained" color="primary" onClick={handleReset}>
                  <Link to="/" className={classes.link}>Volver</Link>
                </Button>
              </div>
            </div >
          ) : (
            <div className={classes.container}>
              <Typography component={'div'} className={classes.instructions}>{getStepContent(activeStep)}</Typography>
              <div className={classes.buttons}>
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
     );
}

export default StepperContainer;
