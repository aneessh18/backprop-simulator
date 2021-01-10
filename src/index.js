import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Backprop from './App';
import reportWebVitals from './reportWebVitals';
import Adaline from './Adaline'
import Perceptron from './Perceptron';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
function Main()
{
  return (
    <Router>
      <div>
        <nav>
          <li>
            <Link to="/backprop">Backprop Simulator</Link>
          </li>
          <li>
            <Link to="/adaline">Adaline Simulator</Link>
          </li>
          <li>
            <Link to="/perceptron">Perceptron Simulator</Link>
          </li>
        </nav>
        <Switch>
          <Route path="/backprop">
          <Backprop initialWeight={0.2} arch={[2,2,2,1]} epochs={1} learningRate={0.2} trainData = {[[0,0,1],[0,1,0],[1,0,0],[1,1,1]]} />
          </Route>
          <Route path="/adaline">
          <Adaline/>
          </Route>
          <Route path="/perceptron">
          <Perceptron/>
          </Route>
        </Switch>
      </div>   
    </Router>
  )
}
ReactDOM.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
