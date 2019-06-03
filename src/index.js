import React from 'react';
import ReactDOM from 'react-dom';
import Calc from './Calc';
import Chart from './Calc';
import PracticeD3 from './PracticeD3';
import BarChart from './PracticeD3';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<PracticeD3 />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
