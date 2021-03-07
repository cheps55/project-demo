import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

// Bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from './components/Home';
import Detail from './components/Detail';

ReactDOM.render(
  <BrowserRouter>
      <Switch>
          <Route exact={true} path="/" component={Home}/>
          <Route exact={true} path="/detail" component={Detail}/>
      </Switch>
  </BrowserRouter>
  
  , document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
