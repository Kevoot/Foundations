// Algorithms HW1
import { DFANode } from "./DFANode";
import { DFANodeOperation } from "./DFANodeOperation";
import * as vis from "vis";

export let DFAEdgeList = [];

export function compareChar(str: string, char: string): boolean { if (str === char) return true; else return false; };

export class DFAMain {
    public _startNode: DFANode;
    public _edges: vis.Edge[];

    constructor(start: DFANode) {
        this._startNode = start;
    }

    public GetStartNode(): DFANode {
        return this._startNode;
    }

    public SetStartState(node: DFANode): void {
        this._startNode = node;
    }
}

export function clearDivs() {
    document.getElementById("outputStatesTravelled").innerHTML = "";
    document.getElementById("outputAcceptState").innerHTML = "";
}

export function runDFANodes(str: string) {
    // We want a DFA which accepts a string, in this case strings starting with "abab"
    clearDivs();
    DFAEdgeList = [];

    let child_4: DFANode, child_1: DFANode, child_2: DFANode, child_3: DFANode;
    let operations = [];

    let op_a = new DFANodeOperation(compareChar, "a");
    let op_b = new DFANodeOperation(compareChar, "b");

    let start: DFANode, sink: DFANode;
    let mainApp: DFAMain;
    // the operation in a sink node doesn't matter; the string failed comparison.
    sink = new DFANode(4, undefined, false, false);
    sink.AddState({ next: sink, op: op_a });

    child_3 = new DFANode(3, undefined, false, true);
    // If we are at the accepting state, the rest of the string is irrelevant. Loop on itself.
    child_3.AddState({ next: sink, op: op_a });
    child_3.AddState({ next: child_3, op: op_b });

    child_2 = new DFANode(2, new Array({next: child_3, op: op_a}, {next: sink, op: op_b}), false, false);

    child_1 = new DFANode(1, new Array({next: child_2, op: op_b}, {next: sink, op: op_a}), false, false);

    start = new DFANode(0, new Array({next: child_1, op: op_a}), true, false);
    start.AddState({next: start, op: op_b});

    mainApp = new DFAMain(start);

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
    var set = new vis.DataSet(DFAEdgeList);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: DFAEdgeList
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

export function clearEdges() {
    DFAEdgeList = [];
}

window.onload = () => {

}
