import React from 'react';
import * as d3 from 'd3';
import { throwStatement } from '@babel/types';

class BarChart extends React.Component {
    componentDidMount() {
        const data = this.props.data;
        const h = this.props.height;
        const w = this.props.width;
        const svg = d3.select("body")
                      .append("svg")
                      .attr("width", w)
                      .attr("height", h)
                      .style("margin-left", 100)
                      .style("background-color", "skyblue");
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    drawChart() {
        const data = this.props.data;
        const h = this.props.height;
        const w = this.props.width;
        
        d3.select("svg").selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", (d,i) => i * 70)
           .attr("y", (d,i) => h - 10 * d)
           .attr("width", 55)
           .attr("height", (d, i) => d * 10)
           .attr("fill", "green");
        d3.select("svg").selectAll("text")
           .data(data)
           .enter()
           .append("text")
           .text((d) => d)
           .attr("x", (d,i) => i * 70 + 40)
           .attr("y", (d,i) => h - (10 * d) - 3);
    }

    render() {
        return <div id={"#" + this.props.id}></div>
    }
}

class PracticeD3 extends React.Component {
    state = {
        data: [15, 10, 2, 13, 4, 9],
        width: 700,
        height: 500,
        id: 'root'
    }

    render() {
        return (
            <div className="App">
                <BarChart 
                    data={this.state.data} 
                    width={this.state.width} 
                    height={this.state.height} 
                />
                <button onClick={() => this.setState({temperatureData: [10,15,2,5,19]})}>
                    Click to Change Data
                </button>
            </div>
        );
    }
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         temperatureData: [8,5,13,9,12],
    //     };
    // }
    // render() {         
    //     return (
    //         <div ref="container">
    //             <svg ref="mySvg"></svg>
    //             <div ref="temperatures"></div>
    //             <button onClick={() => this.setState({temperatureData: [10,15,2,5,19]})}>
    //                 Click to Change Data
    //             </button>
    //         </div>
            
    //     );
    // }

    // componentDidMount() {                         
    //     d3.select(this.refs.mySvg)
    //         .append("circle")
    //         .attr("cx", 50)
    //         .attr("cy", 50)
    //         .attr("r", 50);
    //     d3.select(this.refs.temperatures)
    //         .selectAll("h2")
    //         .data(this.state.temperatureData)
    //         .enter()
    //         .append("h2")
    //         .text((datapoint) => datapoint + " degrees")
    //         .style("color", (datapoint) => {if (datapoint > 10) { return "red"} else { return "blue"}});     
    // }
}

export default PracticeD3;