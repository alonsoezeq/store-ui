import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ProductDescription from './components/ProductDescription';
import 'fontsource-roboto';
import NavBar from './components/NavBar';
import { Box, Container } from '@material-ui/core';
import Users from './components/Users';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Container fixed maxWidth="lg" >
        <Box my={3} display="flex" justifyContent="center" alignItems="center">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/products/:id">
              <ProductDescription />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
