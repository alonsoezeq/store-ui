import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ProductDescription from './components/ProductDescription';
import 'fontsource-roboto';

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/description/:id">
            <ProductDescription />
          </Route>
        </Switch>
    </Router>  
  );
}

export default App;
