// Algorithms HW1
import { DFANode } from "./DFANode";
import { DFANodeOperation } from "./DFANodeOperation";
import * as vis from "vis";

export let edgeList = [];

export function compareChar(str: string, char: string): boolean { if (str === char) return true; else return false; };

export class main {
    public _startNode: DFANode;
    public _edges: vis.Edge[];

    constructor(start: DFANode) {
        this._startNode = start;
    }

    public GetStartNode(): DFANode {
        return this._startNode;
    }

    public SetTrueState(node: DFANode): void {
        this._startNode.SetTrueState(node);
    }

    public SetFalseState(node: DFANode): void {
        this._startNode.SetFalseState(node);
    }
}

export function clearDivs() {
    document.getElementById("outputStatesTravelled").innerHTML = "";
    document.getElementById("outputAcceptState").innerHTML = "";
}

export function runNodes(str: string) {
    // We want a DFA which accepts a string, in this case strings starting with "abab"
    clearDivs();
    edgeList = [];

    let op_0, op_1, op_2, op_3, child_1, child_2, child_3;
    let operations = [];

    op_0 = new DFANodeOperation(compareChar, "a");
    op_1 = new DFANodeOperation(compareChar, "b");
    op_2 = new DFANodeOperation(compareChar, "a");
    op_3 = new DFANodeOperation(compareChar, "b");

    let start: DFANode, sink: DFANode;
    let mainApp: main;
    // the operation in a sink node doesn't matter; the string failed comparison.
    sink = new DFANode(4, op_0, undefined, undefined);
    sink.SetTrueState(sink);
    sink.SetFalseState(sink);

    child_3 = new DFANode(3, op_3, undefined, undefined, false, true);
    // If we are at the accepting state, the rest of the string is irrelevant. Loop on itself.
    child_3.SetTrueState(child_3);
    child_3.SetFalseState(child_3);

    child_2 = new DFANode(2, op_2, child_3, sink);
    child_1 = new DFANode(1, op_1, child_2, sink);

    start = new DFANode(0, op_0, child_1, sink, true, false);

    mainApp = new main(start);

    document.getElementById("outputStatesTravelled").innerHTML = "Testing: " + str + "<br>";
    mainApp._startNode.MoveToNextState(str);

    var nodes = new vis.DataSet([
        { id: 0, label: 'q0 (start)' },
        { id: 1, label: 'q1'},
        { id: 2, label: 'q2'},
        { id: 3, label: 'q3 (accept)'},
        { id: 4, label: 'q4 (sink)'}
    ]);

    // create an array with edges
    var set = new vis.DataSet(edgeList);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edgeList
    };
    let options: vis.Options = {
        edges: {
            arrows: {
                to: {
                    enabled: true
                },
                middle: {
                    enabled: false
                },
                from: {
                    enabled: false
                }
            }
        }
    };
    var network = new vis.Network(container, data, options);
}

$(document).on("click", "#submitButton", (e) => {
    let str = (<HTMLInputElement>document.getElementById("inputString")).value;
    runNodes(str);
})

window.onload = () => {

}
