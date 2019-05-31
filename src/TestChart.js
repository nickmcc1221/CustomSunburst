import React, {Component} from 'react';
import c3 from 'c3';

class TestChart extends Component {
    constructor(props) {
        super(props);

    }

    renderChart() {
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['data1',30,200,100,400,150,250],
                    ['data2',50,20,10,40,15,25] 
                ]
            }
        });
    }

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    render() {
        return (
            <div>
                <h1>Hello</h1>
                <div id="chart"></div>
            </div>
        );
    }
}

export default TestChart;