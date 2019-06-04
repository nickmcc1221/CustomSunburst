import React from 'react';
import Excel, { Workbook } from 'exceljs';
import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "5a3cb19b695d558f";

class TestSunburst extends React.Component {
    chartRef = React.createRef();
    componentDidMount() {
        // var workbook = new Excel.Workbook();
        // workbook.xlsx.readFile("mnt/c/Users/aiuhjc9/Documents/testbook.xlsx");
        // const book = [];
        // workbook.eachSheet( sheet => {
        //     sheet = [];
        //     worksheet.eachRow(row => {
        //         sheet.push(row.values);
        //     });
        // book.push(sheet);
        // });
        // const json = JSON.stringify(book);
        // console.log(json);
        // this.parseExcel("mnt/c/Users/aiuhjc9/Documents/testbook.xlsx");
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

    // parseExcel(file) {
    //     var reader = new FileReader();
    
    //     reader.onload = function(e) {
    //     var data = e.target.result();
    //     var workbook = XLSX.read(data, {
    //         type: 'binary'
    //     });
    
    //     workbook.SheetNames.forEach(function(sheetName) {
    //         // Here is your object
    //         var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    //         var json_object = JSON.stringify(XL_row_object);
    //         console.log(json_object);
    
    //     })
    
    //     };
    
    //     reader.onerror = function(ex) {
    //     console.log(ex);
    //     };
    
    //     reader.readAsBinaryString(file);
    // }
}

export default TestSunburst;