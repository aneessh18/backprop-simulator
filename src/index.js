import React from 'react';
import ReactDOM from 'react-dom';
import Corpus from './components/Corpus';
import './index.css';
import Backprop from './components/Backprop';
import reportWebVitals from './reportWebVitals';
import Adaline from './components/Adaline'
import Perceptron from './components/Perceptron';
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
          <li>
          <Link to="/corpuscalculator">Corpus Calculator</Link>
          </li>
        </nav>
        <Switch>
          <Route path="/backprop">
            <Backprop initialWeight={0.2} arch={[2,2,2,1]} epochs={1} learningRate={0.2} trainData = {[[0,0,1],[0,1,0],[1,0,0],[1,1,1]]} momentum={0} />
          </Route>
          <Route path="/adaline">
            <Adaline/>
          </Route>
          <Route path="/perceptron">
            <Perceptron/>
          </Route>
          <Route path="/corpuscalculator">
            <Corpus 
              retirementYear = {2046}
              durationAfterPostRetirement = {20}
              riskRate = {5}
              consumptionPerYear = {600000}
              currentYear= {2021}
            />
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
