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
import NewStore from './pages/NewStore';
import Stores from './pages/Stores';
import Login from './pages/Login';

const routes = [
  { path: '/products/new', component: NewProduct },
  { path: '/products/:id', component: ProductDescription },
  { path: '/stores/new', component: NewStore },
  { path: '/stores', component: Stores },
  { path: '/cart', component: Cart },
  { path: '/users', component: Users },
  { path: '/login', component: Login },
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
                <Route key={path} exact path={path} component={component} />
              )
            }
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}

export default App;