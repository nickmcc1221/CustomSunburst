import React from 'react';

import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "5a3cb19b695d558f";

class TestSunburst extends React.Component {
    constructor(props) {
        super(props);
        var nodeData = {
            "name": "Company", "children": [{
                "name": "Amway",
                    "children": [{
                        "name": "Nick", "children": [{
                            "name": "Bob", "size": 4}]}, {
                        "name": "Aziz", "size": 4}]
            }, {
                "name": "Neapco",
                    "children": [{"name": "Max", "size": 3}]
            }, {
                "name": "Freddy's",
                    "children": [{"name": "Sam", "size": 4}, {"name": "Hannah", "size": 4}]
            }]
        };
        this.state = {
            data: nodeData,
        };
    }
    chartRef = React.createRef();
    componentDidMount() {
        const runtime = new Runtime();
        runtime.module(notebook, name => {
            if (name === "chart") {
                return new Inspector(this.chartRef.current);
            }
        });
    }

    render () {
        return (
            <div className="App">
                <div ref={this.chartRef}></div>
            </div>

        );
    }
}

export default TestSunburst;