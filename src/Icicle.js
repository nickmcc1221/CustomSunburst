import React from 'react';
import * as d3 from "d3";
import readXlsxFile from 'read-excel-file';

class Icicle extends React.Component {

    createIcicle(selectedFile) {
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

                    //Make this a child of 'base' layer
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

                //Only execute once for each sub-category
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

                //Only execute once for each industry cut
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

                //Only execute once for each description
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

                //Only execute once for each SKU
                if (this.checkUniqueItemName(allSKUs, allLineItems[i].SKU)) {
                    var newSKU = {
                        name: allLineItems[i].SKU,
                        children: [],
                        value: 1
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
            var partition = data => {
                const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => b.height - a.height || b.value - a.value);  
                return d3.partition()
                    .size([height, (root.height + 1) * width / 3])
                  (root);
              };
            var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
            var format = d3.format(",d");
            var width = 975;
            var height = 600;
    
            const root = partition(data);
            let focus = root;
    
            const svg = d3.select("#packSVG")
                .attr("viewBox", [0, 0, width, height])
                .style("font", "10px sans-serif");
    
            const cell = svg
                .selectAll("g")
                .data(root.descendants())
                .join("g")
                .attr("transform", d => `translate(${d.y0},${d.x0})`);
    
            const rect = cell.append("rect")
                .attr("width", d => d.y1 - d.y0 - 1)
                .attr("height", d => rectHeight(d))
                .attr("fill-opacity", 0.6)
                .attr("fill", d => {
                    if (!d.depth) return "#ccc";
                    while (d.depth > 1) d = d.parent;
                    return color(d.data.name);
                })
                .style("cursor", "pointer")
                .on("click", clicked);
    
            const text = cell.append("text")
                .style("user-select", "none")
                .attr("pointer-events", "none")
                .attr("x", 4)
                .attr("y", 13)
                .attr("fill-opacity", d => +labelVisible(d));
    
            text.append("tspan")
                .text(d => d.data.name);
    
            const tspan = text.append("tspan")
                .attr("fill-opacity", d => labelVisible(d) * 0.7)
                .text(d => ` ${format(d.value)}`);
    
            cell.append("title")
                .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    
            function clicked(p) {
                focus = focus === p ? p = p.parent : p;
    
                root.each(d => d.target = {
                x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
                x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
                y0: d.y0 - p.y0,
                y1: d.y1 - p.y0
                });
    
                const t = cell.transition().duration(750)
                    .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
    
                rect.transition(t).attr("height", d => rectHeight(d.target));
                text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
                tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.7);
            }
            
            function rectHeight(d) {
                return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
            }
    
            function labelVisible(d) {
                return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
            }
        });
    }

    //Takes an array and the name (String)
    //Checks if any element of the array contains an element with a matching name property
    checkUniqueItemName(array, name) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].name === name) {
                return false;
            }
        }
        return true;
    }

    //Called to render onto the DOM. Has input form for file choosing and sets up SVG for sunburst
    render() {
        return (
            <div className="App">
                <form id="inputForm">
                    <label>
                        Upload file:
                        <input type="file" onChange={ (e) => this.createIcicle(e.target.files)} />
                    </label>
                    <br/>
                </form>
                <svg id="packSVG" width="1500" height="900"></svg>
            </div>
        );
    }
}

export default Icicle;