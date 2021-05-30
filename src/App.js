import { BrowserRouter as Router,
  Switch,
  Route,
  Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ProductDescription from './components/ProductDescription';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/description/1">Descripcion del producto</Link>
            </li>
          </ul>
        </nav>
        <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/description/:id">
          <ProductDescription />
        </Route>
        </Switch>
      </div>
    </Router>  
  );
}

export default App;
