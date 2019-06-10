import React from 'react';
import readXlsxFile from 'read-excel-file';
import * as d3 from "d3";

class TestSunburst extends React.Component {

    createSunburst(selectedFile) {

        //Remove the upload button
        d3.select("#inputForm").remove();

        //Read in XLSX and convert to JSON
        readXlsxFile(selectedFile[0]).then((rows) => {

            //This loop reads the rows and stores the information as a  lineItem object, and then stores them all in one large array
            var allLineItems = [];
            for (var i = 1; i < rows.length; i++) {
                var lineItem = {
                    SKU: rows[i][0],
                    desc: rows[i][1],
                    businessLine: rows[i][2],
                    category: rows[i][3],
                    subCategory: rows[i][4],
                    industryCut: rows[i][5]
                };
                allLineItems.push(lineItem);
            }

            var data = {
                name: "base",
                children: []
            };
            //Populate this array with all of the business lines that will represent the first layer of the hierarchy
            var allBusinessLines = [];
            for (var i = 0; i < allLineItems.length; i++) {

                //Only execute once for each business line
                if (this.checkUniqueItemName(allBusinessLines, allLineItems[i].businessLine)) {
                    var newBusinessLine = {
                        name: allLineItems[i].businessLine,
                        children: []
                    };
                    allBusinessLines.push(newBusinessLine);
                    data.children.push(newBusinessLine);
                }
            }

            //Populate array with categories and add categories to be children of their business lines
            var allCategories = [];
            for (var i = 0; i < allLineItems.length; i++) {

                //Only execute once for each category
                if (this.checkUniqueItemName(allCategories, allLineItems[i].category)) {
                    var newCategory = {
                        name: allLineItems[i].category,
                        children: []
                    };
                    allCategories.push(newCategory);

                    //adds new category as child to its respective business line
                    for (var j = 0; j < allBusinessLines.length; j++) {
                        if (allLineItems[i].businessLine === allBusinessLines[j].name) {
                            allBusinessLines[j].children.push(newCategory);
                        }
                    }
                }
            }

            //Populate array with sub-categories and add them to their parents
            var allSubCategories = [];
            for (var i = 0; i < allLineItems.length; i++) {

                //Only execute once for each category
                if (this.checkUniqueItemName(allSubCategories, allLineItems[i].subCategory)) {
                    var newSubCategory = {
                        name: allLineItems[i].subCategory,
                        children: []
                    };
                    allSubCategories.push(newSubCategory);

                    //adds new sub-category as child to its respective category
                    for (var j = 0; j < allCategories.length; j++) {
                        if (allLineItems[i].category === allCategories[j].name) {
                            allCategories[j].children.push(newSubCategory);
                        }
                    }
                }
            }

            //Populate array with industryCuts and add them to their parents
            var allIndustryCuts = [];
            for (var i = 0; i < allLineItems.length; i++) {

                //Only execute once for each category
                if (this.checkUniqueItemName(allIndustryCuts, allLineItems[i].industryCut)) {
                    var newIndustryCut = {
                        name: allLineItems[i].industryCut,
                        children: [],
                    };
                    allIndustryCuts.push(newIndustryCut);

                    //adds new industry cut as child to its respective sub-category
                    for (var j = 0; j < allSubCategories.length; j++) {
                        if (allLineItems[i].subCategory === allSubCategories[j].name) {
                            allSubCategories[j].children.push(newIndustryCut);
                        }
                    }
                }
            }

            //Populate array with descriptions and add them to their parents
            var allDescs = [];
            for (var i = 0; i < allLineItems.length; i++) {

                //Only execute once for each category
                if (this.checkUniqueItemName(allDescs, allLineItems[i].desc)) {
                    var newDesc = {
                        name: allLineItems[i].desc,
                        children: [],
                    };
                    allDescs.push(newDesc);

                    //adds new description as child to its respective industry cut
                    for (var j = 0; j < allIndustryCuts.length; j++) {
                        if (allLineItems[i].industryCut === allIndustryCuts[j].name) {
                            allIndustryCuts[j].children.push(newDesc);
                        }
                    }
                }
            }

            //Populate array with SKUs and add them to their parents
            var allSKUs = [];
            for (var i = 0; i < allLineItems.length; i++) {

                //Only execute once for each category
                if (this.checkUniqueItemName(allSKUs, allLineItems[i].SKU)) {
                    var newSKU = {
                        name: allLineItems[i].SKU,
                        children: [],
                        value: 20
                    };
                    allSKUs.push(newSKU);

                    //adds new SKU as child to its respective description
                    for (var j = 0; j < allDescs.length; j++) {
                        if (allLineItems[i].desc === allDescs[j].name) {
                            allDescs[j].children.push(newSKU);
                        }
                    }
                }
            }

            //imports the JSON file that contains all of the data to be displayed on the sunburst
            //var data = require("/mnt/c/Users/aiuhjc9/git/test/testapp/src/myJSON.json");
            var partition = data => {
                const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => b.value - a.value);
                return d3.partition()
                    .size([2 * Math.PI, root.height + 1])
                    (root);
            };

            //Color scheme for sunburst
            var color = d3.scaleOrdinal(d3.quantize(d3.interpolateCool, data.children.length + 1));

            //number format
            var format = d3.format(",d");
            
            //Sizing for sunburst
            var width = 1000;
            var radius = width / 6;
            var arc = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                .padRadius(radius * 1.5)
                .innerRadius(d => d.y0 * radius)
                .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
            

            const root = partition(data);

            root.each(d => d.current = d);
            
            //set up svg that will hold the sunburst
            const svg = d3.select("#packSVG")
                .attr("viewBox", [0, 0, width, width])
                .style("font", "10px sans-serif")
            
            const g = svg.append("g")
                .attr("transform", `translate(${width / 2},${width / 2})`);
            
            //This represents the 'slices' of the sunburst. All of their customizations are done here with attributes
            const path = g.append("g")
                .selectAll("path")
                .data(root.descendants().slice(1))
                .join("path")
                .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })

                //Slices with children appear darker in color with more opacity
                .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)

                //These mouse events 'highlights' the section of the sunburst that the cursor is currently over by changing opacity
                .on("mouseover", function(d) {
                    d3.select(this).attr("fill-opacity", d => arcVisible(d.current) ? 1.0 : 0);
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                })

                .attr("d", d => arc(d.current));
            
            path.filter(d => d.children)
                .style("cursor", "pointer")
                .on("click", clicked);
            
            path.append("title")
                .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
            
            //Represents the labels on the slices of the sunburst. Customizations done here for text on the sunburst
            const label = g.append("g")
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle")
                .style("user-select", "none")
                .selectAll("text")
                .data(root.descendants().slice(1))
                .join("text")
                .attr("dy", "0.35em")
                .attr("fill-opacity", d => +labelVisible(d.current))
                .style("fill", "black")
                .attr("transform", d => labelTransform(d.current))
                .text(d => d.data.name);
            
            //Represents the center circle that allows for backtracking through the sunburst. Customization done here for the center of the diagram
            const parent = g.append("circle")
                .datum(root)
                .attr("r", radius)
                .attr("fill", "none")

                //Adds hightlight on hover, has opacity so animation can be seen through it
                // .on("mouseover", function() {
                //     d3.select(this).attr("fill", "darkgray")
                //         .attr("fill-opacity", 0.5)
                // })
                // .on("mouseout", function() {
                //     d3.select(this).attr("fill", "none")
                // })

                .attr("pointer-events", "all")
                .on("click", clicked);
            
            //Function handles when you click on a slice
            function clicked(p) {
                parent.datum(p.parent || root);
            
                root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
                });
            
                const t = g.transition().duration(750);
            
                // Transition the data on all arcs, even the ones that aren’t visible,
                // so that if this transition is interrupted, entering arcs will start
                // the next transition from the desired position.
                path.transition(t)
                    .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                    })
                .filter(function(d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                    .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                    .attrTween("d", d => () => arc(d.current));
            
                label.filter(function(d) {
                    return +this.getAttribute("fill-opacity") || labelVisible(d.target);
                }).transition(t)
                    .attr("fill-opacity", d => +labelVisible(d.target))
                    .attrTween("transform", d => () => labelTransform(d.current));
            }
            
            //Checks if slice is currently displayed
            function arcVisible(d) {
                return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
            }
            
            //Checks if label is currently displayed
            function labelVisible(d) {
                return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
            }
            
            //Rotates label to be oriented with its slice
            function labelTransform(d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2 * radius;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            }
        });   
    }

    checkUniqueItemName(array, name) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].name === name) {
                return false;
            }
        }
        return true;
    }

    render() {
        return (
            <div className="App">
                <form id="inputForm">
                    <label>
                        Upload file:
                        <input type="file" onChange={ (e) => this.createSunburst(e.target.files)} />
                    </label>
                    <br/>
                </form>
                <svg id="packSVG" width="1500" height="900"></svg>
            </div>
        );
    }
}

export default TestSunburst;