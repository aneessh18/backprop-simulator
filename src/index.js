import React from 'react';
import ReactDOM from 'react-dom';
import Corpus from './components/Corpus';
import './index.css';
import Backprop from './components/Backprop';
import reportWebVitals from './reportWebVitals';
import Adaline from './components/Adaline'
import Perceptron from './components/Perceptron';
import Docs from "./components/Docs";
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
          <li>
            <Link to="/collaborate">write docs together</Link>
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
          <Route path="/collaborate">
            <Docs text={`Wikipedia (/ˌwɪkɪˈpiːdiə/ (About this soundlisten) wik-ih-PEE-dee-ə or /ˌwɪki-/
            (About this soundlisten) wik-ee-) is a free, multilingual open-collaborative online encyclopedia created and maintained by a community of volunteer editors using a wiki-based editing system. 
            It is one of the 15 most popular websites as ranked by Alexa, as of January 2021[3]
             and The Economist newspaper placed it as the "13th-most-visited place on the web".
             [4] Featuring no advertisements, it is hosted by the Wikimedia Foundation, an
              American non-profit organization funded primarily through donations.

          Wikipedia was launched on January 15, 2001, by Jimmy Wales 
          and Larry Sanger. Sanger coined its name[5][6] as a portmanteau 
          of "wiki" and "encyclopedia". It was initially an English-language 
          encyclopedia, but versions in other languages were quickly developed.
           With 6.2 million articles, the English Wikipedia is the largest of the 317 
           Wikipedia encyclopedias. Overall, Wikipedia comprises more than 55 million
            articles,[7] attracting 1.7 billion unique visitors per month.[8][9]

Wikipedia has been criticized for its uneven accuracy and for exhibiting systemic bias, 
including gender bias, with the majority of editors being male.[4] Edit-a-thons have been held to
 encourage female editors and increase the coverage of women's topics.[10] In 2006, 
 Time magazine stated that the open-door policy of allowing anyone to edit had made Wikipedia 
 the biggest and possibly the best encyclopedia in the world, and was a testament to the vision
  of Jimmy Wales.[11] The project's reputation improved further in the 2010s as it increased 
  efforts to improve its quality and reliability, based on its unique structure, curation and
   absence of commercial bias.[4] In 2018, Facebook and YouTube announced that they would help
    users detect fake news by suggesting links to related Wikipedia articles.[12]`}/>
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
