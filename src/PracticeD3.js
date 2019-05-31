import React from 'react';
import * as d3 from 'd3';

class PracticeD3 extends React.Component {
    render() {  
        
        return (
            <div ref="container">
                <svg ref="mySvg"></svg>
                <div ref="temperatures"></div>
            </div>
            
        );
    }

    componentDidMount() {                         
        d3.select(this.refs.mySvg)
            .append("circle")
            .attr("cx", 25)
            .attr("cy", 25)
            .attr("r", 25)
        const temperatureData = [8,5,13,9,12];
        d3.select(this.refs.temperatures)
            .selectAll("h2")
            .data(temperatureData)
            .enter()
            .append("h2")
            .text((datapoint) => datapoint + " degrees")
            .style("color", (datapoint) => {if (datapoint > 10) { return "red"} else { return "blue"}})
    }

    componentDidUpdate() {
        //TODO
    }

    componentWillUnmount() {
        //TODO
    }
}

export default PracticeD3;
