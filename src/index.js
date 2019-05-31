import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import Calc from './Calc';
import Chart from './Calc';
import TestChart from './TestChart';
import PracticeD3 from './PracticeD3';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<PracticeD3 />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
