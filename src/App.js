import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ProductDescription from './components/ProductDescription';
import 'fontsource-roboto';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products/:id">
          <ProductDescription />
        </Route>
      </Switch>
    </Router>  
  );
}

export default App;
