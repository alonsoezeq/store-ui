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

const App = () => {
  return (
    <Router>
      <NavBar />
      <Container fixed maxWidth="lg" >
        <Box my={3} display="flex" justifyContent="center" alignItems="center">
          <Switch>
            <Route path="/products/new">
              <NewProduct />
            </Route>
            <Route path="/products/:id">
              <ProductDescription />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <Error404 />
            </Route>
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}

export default App;