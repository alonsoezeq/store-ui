import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box, CircularProgress, Container, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './App.css';
import Home from './pages/Home';
import ProductDescription from './pages/ProductDescription';
import Error404 from './pages/Error404';
import Users from './pages/Users';
import 'fontsource-roboto';
import NavBar from './components/NavBar';
import ProductAddForm from './pages/ProductAddForm';
import ProductEditForm from './pages/ProductEditForm';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Stores from './pages/Stores';
import Login from './pages/Login';
import { isAdmin, isAuthenticated, isBuyer, isSeller } from './helpers/AuthUtils';
import StoreAddForm from './pages/StoreAddForm';
import StoreEditForm from './pages/StoreEditForm';
import Profile from './pages/Profile';
import { AppContext } from './AppContext';
import { useState } from 'react';

const routes = [
  { path: '/products/add', component: ProductAddForm, condition: (isSeller() || isAdmin()) },
  { path: '/products/:id/edit', component: ProductEditForm, condition: (isSeller() || isAdmin()) },
  { path: '/products/:id', component: ProductDescription },
  { path: '/stores/add', component: StoreAddForm, condition: (isSeller() || isAdmin()) },
  { path: '/stores/:id/edit', component: StoreEditForm, condition: (isSeller() || isAdmin()) },
  { path: '/stores', component: Stores },
  { path: '/cart', component: Cart, condition: isBuyer() },
  { path: '/users', component: Users, condition: isAdmin() },
  { path: '/profile', component: Profile, condition: isAuthenticated() },
  { path: '/login', component: Login, condition: !isAuthenticated() },
  { path: '/register', component: Register, condition: !isAuthenticated() },
  { path: '/', component: Home },
  { path: '*', component: Error404 }
];

const App = () => {
  
  const [context, setContext] = useState({
    title: '',
    loading: false,
    status: null,
    message: null
  });

  const { title, loading, status, message } = context;

  const handleSnackbarClose = () => {
    setContext({...context, status: null, message: null});
  }

  return (
    <AppContext.Provider value={[context, setContext]}>
      <Router>
        <NavBar title={title} />
        <Container fixed maxWidth="lg" >
          <Box my={3} display="flex" justifyContent="center" alignItems="center">
            <Switch>
              {
                routes.map(({path, component, condition}) => 
                  (condition === undefined || condition === true) &&
                  <Route key={path} exact path={path} component={component} />
                )
              }
            </Switch>
            {
              loading &&
              <CircularProgress />
            }
            {
              status && 
              <Snackbar open={status !== null} autoHideDuration={6000}>
                <Alert severity={status} onClose={handleSnackbarClose}>{message?.toString()}</Alert>
              </Snackbar>
            }
          </Box>
        </Container>
      </Router>
    </AppContext.Provider>
  );
}

export default App;