import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box, Container } from '@material-ui/core';
import './App.css';
import Home from './pages/Home';
import ProductDescription from './pages/ProductDescription';
import Error404 from './pages/Error404';
import Users from './pages/Users';
import 'fontsource-roboto';
import NavBar from './components/NavBar';
import NewProduct from './pages/NewProduct';
import Cart from './pages/Cart';
import Register from './pages/Register';

const routes = [
  { path: '/products/new', component: NewProduct },
  { path: '/products/:id', component: ProductDescription },
  { path: '/cart', component: Cart },
  { path: '/users', component: Users },
  { path: '/register', component: Register },
  { path: '/', component: Home },
  { path: '*', component: Error404 }
];

const App = () => {
  return (
    <Router>
      <NavBar />
      <Container fixed maxWidth="lg" >
        <Box my={3} display="flex" justifyContent="center" alignItems="center">
          <Switch>
            {
              routes.map(({path, component}) => 
                <Route exact path={path} component={component} />
              )
            }
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}

export default App;