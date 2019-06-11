import React from 'react';
import * as d3 from "d3";
import readXlsxFile from 'read-excel-file';

class CollapsibleTree extends React.Component {

    createTree(selectedFile) {
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

            var width = 1000;
            var dx = 10;
            var dy = width / 6;
            var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
            var tree = d3.tree().nodeSize([dx, dy]);
            var margin = ({top: 10, right: 120, bottom: 10, left: 40});

            const root = d3.hierarchy(data);

            root.x0 = dy / 2;
            root.y0 = 0;
            root.descendants().forEach((d, i) => {
                d.id = i;
                d._children = d.children;
                if (d.depth && d.data.name.length !== 7) d.children = null;
            });

            const svg = d3.select("#packSVG")
                .attr("viewBox", [-margin.left, -margin.top, width, dx])
                .style("font", "10px sans-serif")
                .style("user-select", "none");

            const gLink = svg.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5);

            const gNode = svg.append("g")
                .attr("cursor", "pointer")
                .attr("pointer-events", "all");

            function update(source) {
                const duration = d3.event && d3.event.altKey ? 2500 : 250;
                const nodes = root.descendants().reverse();
                const links = root.links();

                // Compute the new tree layout.
                tree(root);

                let left = root;
                let right = root;
                root.eachBefore(node => {
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
                });

                const height = right.x - left.x + margin.top + margin.bottom;

                const transition = svg.transition()
                    .duration(duration)
                    .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
                    .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

                // Update the nodes…
                const node = gNode.selectAll("g")
                .data(nodes, d => d.id);

                // Enter any new nodes at the parent's previous position.
                const nodeEnter = node.enter().append("g")
                    .attr("transform", d => `translate(${source.y0},${source.x0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .on("click", d => {
                    d.children = d.children ? null : d._children;
                    update(d);
                    });

                nodeEnter.append("circle")
                    .attr("r", 2.5)
                    .attr("fill", d => d._children ? "#555" : "#999")
                    .attr("stroke-width", 10);

                nodeEnter.append("text")
                    .attr("dy", "0.31em")
                    .attr("x", d => d._children ? -6 : 6)
                    .attr("text-anchor", d => d._children ? "end" : "start")
                    .text(d => d.data.name)
                .clone(true).lower()
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-width", 3)
                    .attr("stroke", "white");

                // Transition nodes to their new position.
                const nodeUpdate = node.merge(nodeEnter).transition(transition)
                    .attr("transform", d => `translate(${d.y},${d.x})`)
                    .attr("fill-opacity", 1)
                    .attr("stroke-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                const nodeExit = node.exit().transition(transition).remove()
                    .attr("transform", d => `translate(${source.y},${source.x})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0);

                // Update the links…
                const link = gLink.selectAll("path")
                .data(links, d => d.target.id);

                // Enter any new links at the parent's previous position.
                const linkEnter = link.enter().append("path")
                    .attr("d", d => {
                    const o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.merge(linkEnter).transition(transition)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition(transition).remove()
                    .attr("d", d => {
                    const o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                    });

                // Stash the old positions for transition.
                root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
                });
            }

            update(root);
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

    render() {
        return (
            <div className="App">
                <form id="inputForm">
                    <label>
                        Upload file:
                        <input type="file" onChange={ (e) => this.createTree(e.target.files)} />
                    </label>
                    <br/>
                </form>
                <svg id="packSVG" width="1500" height="900"></svg>
            </div>
        );
    }
}

export default CollapsibleTree;