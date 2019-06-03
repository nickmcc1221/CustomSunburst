import React from 'react';
import BarChart from './BarChart';
import './calcStyle.css';

class Chart extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <BarChart data={[5,10,1,3,4,5,1,3,7,18]} size={[500,500]} />
                </div>
            </div>
        );
    }
}

class Calc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentOp: "",
            firstNum: "",
            secondNum: "",
        };
    }

    numberClick(num) {
        if (!this.state.currentOp) {
            this.setState({
                firstNum: this.state.firstNum + num,
            });
        } else {
            this.setState({
                secondNum: this.state.secondNum + num,
            });
        }
    }

    clearClick() {
        this.setState({
            currentOp: "",
            firstNum: "",
            secondNum: "",
        });
    }

    opClick(op) {
        if (this.state.currentOp && !this.state.secondNum) {
            return;
        }
        if (this.state.currentOp) {
            this.setState({
                firstNum: this.calculate(this.state.firstNum, this.state.secondNum, this.state.currentOp),
                currentOp: op,
                secondNum: "",
            })
        }
        this.setState({
            currentOp: op,
        });
    }

    equalClick() {
        this.setState({
            firstNum: this.calculate(this.state.firstNum, this.state.secondNum, this.state.currentOp),
            currentOp: "",
            secondNum: "",
        })
    }

    calculate(fNum, sNum, op) {
        switch (op) {
            case "+":
                return (parseFloat(fNum) + parseFloat(sNum)).toFixed(2);
            case "-":
                return (parseFloat(fNum) - parseFloat(sNum)).toFixed(2);
            case "*":
                return (parseFloat(fNum) * parseFloat(sNum)).toFixed(2);
            case "/":
                return (parseFloat(fNum) / parseFloat(sNum)).toFixed(2);
            default:
                return NaN;
        }
    }

    render() {
        const data = {};
        data.width = 500;
        data.height = 750;
        data.dataset = [
            {label: 'apples', value: 25},
            {label: 'oranges', value: 30},
            {label: 'surfboards', value: 150}
        ];
        data.margins = {top: 20, right: 10, bottom: 0, left: 10};
        data.yAxisLabel = 'Y VALUE';
        data.fill = ['lemonChiffon', 'aliceBlue', 'sandyBrown'];
        data.ticks = 10;
        data.barClass = 'barChart';
        var displayMsg = this.state.firstNum + this.state.currentOp + this.state.secondNum;
        if (!displayMsg) {
            displayMsg = "Welcome!";
        }
        return (
            <div>
                <div className="displayBox">
                    <h1>
                        {displayMsg}
                    </h1>
                </div>
                <div className="operationRow">
                    <button className="opButton" onClick={() => this.opClick("+")}>
                        +
                    </button>
                    <button className="opButton" onClick={() => this.opClick("-")}>
                        -
                    </button>
                    <button className="opButton" onClick={() => this.opClick("*")}>
                        *
                    </button>
                    <button className="opButton" onClick={() => this.opClick("/")}>
                        /
                    </button>
                    <button className="opButton" onClick={() => this.equalClick()}>
                        =
                    </button>
                    <button className="opButton" onClick={() => this.clearClick()}>
                        C
                    </button>
                </div>
                <div className="numberRow">
                    <button className="numberButton" onClick={() => this.numberClick(1)}>
                        1
                    </button>
                    <button className="numberButton" onClick={() => this.numberClick(2)}>
                        2
                    </button>
                    <button className="numberButton" onClick={() => this.numberClick(3)}>
                        3
                    </button>
                </div>
                <div className="numberRow">
                    <button className="numberButton" onClick={() => this.numberClick(4)}>
                        4
                    </button>
                    <button className="numberButton" onClick={() => this.numberClick(5)}>
                        5
                    </button>
                    <button className="numberButton" onClick={() => this.numberClick(6)}>
                        6
                    </button>
                </div>
                <div className="numberRow">
                    <button className="numberButton" onClick={() => this.numberClick(7)}>
                        7
                    </button>
                    <button className="numberButton" onClick={() => this.numberClick(8)}>
                        8
                    </button>
                    <button className="numberButton" onClick={() => this.numberClick(9)}>
                        9
                    </button>
            </div>
        </div>
        );
    }
}

export default Calc;