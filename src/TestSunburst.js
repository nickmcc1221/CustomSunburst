import React from 'react';
// import Sunburst from 'react-sunburst-d3-v4';

import {Runtime, Inspector} from "@observablehq/runtime";
// import notebook from "@mbostock/zoomable-sunburst";
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
// onSelect(event) {
    //     console.log(event);
    // }

    // render() {
    //     var nodeData = {
    //         "name": "Company", "children": [{
    //             "name": "Amway",
    //                 "children": [{
    //                     "name": "Nick", "children": [{
    //                         "name": "Bob", "size": 4}]}, {
    //                     "name": "Aziz", "size": 4}]
    //         }, {
    //             "name": "Neapco",
    //                 "children": [{"name": "Max", "size": 3}]
    //         }, {
    //             "name": "Freddy's",
    //                 "children": [{"name": "Sam", "size": 4}, {"name": "Hannah", "size": 4}]
    //         }]
    //     };
    //     return (
    //         <div className="App">
    //             <Sunburst
    //                 data={nodeData}
    //                 onSelect={this.onSelect}
    //                 scale="linear"
    //                 tooltipContent={<div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; padding: 5px; text-align: center;" /> }
    //                 tooltip
    //                 tolltipPosition="right"
    //                 keyId="anagraph"
    //                 width="480"
    //                 height="400"
    //             />
    //         </div>
    //     );
    // }