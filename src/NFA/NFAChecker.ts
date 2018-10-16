// Algorithms HW1
import { NFANode } from "./NFANode";
import { NFANodeOperation } from "./NFANodeOperation";
import * as vis from "vis";
import { State } from "../utils/Types";

export let NFAEdgeList = [];

export function compareChar(str: string, char: string): boolean { if (str === char) return true; else return false; };

export class NFAMain {
    public _startNode: NFANode;
    public _edges: vis.Edge[];

    constructor(start: NFANode) {
        this._startNode = start;
    }

    public GetStartNode(): NFANode {
        return this._startNode;
    }
}

export function clearDivs() {
    document.getElementById("outputStatesTravelled").innerHTML = "";
    document.getElementById("outputAcceptState").innerHTML = "";
}

export function runNFANodes(str: string): NFANode {
    // We want a DFA which accepts a string, in this case strings starting with "abab"
    clearDivs();
    NFAEdgeList = [];

    let child_1: NFANode, child_2: NFANode, child_3: NFANode;

    let op_eps = new NFANodeOperation(compareChar, "", true);
    let op_a = new NFANodeOperation(compareChar, "a");
    let op_b = new NFANodeOperation(compareChar, "b");

    let start: NFANode;

    child_1 = new NFANode(1, undefined, false, false);
    child_2 = new NFANode(2, undefined, false, false);
    child_3 = new NFANode(3, undefined, false, true);

    start = new NFANode(0, new Array<State>({
        next: child_1,
        op: op_eps
    }), true, false);

    child_1.AddState({next: child_2, op: op_a});
    child_1.AddState({next: child_2, op: op_b});
    child_2.AddState({next: child_3, op: op_a});

    child_3.AddState({next: child_3, op: op_a});
    child_3.AddState({next: child_3, op: op_b});

    let mainApp = new NFAMain(start);

    document.getElementById("outputStatesTravelled").innerHTML = "Testing: " + str + "<br>";
    mainApp._startNode.MoveToNextState(str);

    var nodes = new vis.DataSet([
        { id: 0, label: 'q0 (start)' },
        { id: 1, label: 'q1'},
        { id: 2, label: 'q2'},
        { id: 3, label: 'q3 (accept)'},
    ]);

    // create an array with edges
    var set = new vis.DataSet(NFAEdgeList);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: NFAEdgeList
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

    return mainApp._startNode;
}

export function clearNFAEdges() {
    NFAEdgeList = [];
}

window.onload = () => {

}
