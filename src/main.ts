import { runDFANodes, DFAEdgeList, clearEdges } from "./DFA/DFAChecker";
import { runNFANodes, NFAEdgeList, clearNFAEdges, clearDivs } from "./NFA/NFAChecker";
import { Convert, nodeNums, allNodes } from "./NFAtoDFAConverter/Converter";
import * as vis from "vis";
import { Regex } from "./REtoNFA_redo/Regex";
import { RENodes, REEdgeList, initGlobals } from "./utils/globals";
import { State } from "./REtoNFA_redo/State";
import { NFA } from "./REtoNFA_redo/NFA";

export function getStringInput(): string {
    return (<HTMLInputElement>document.getElementById("inputString")).value;
}

export function getRegexStringInput(): string {
    return (<HTMLInputElement>document.getElementById("regexString")).value;
}

$(document).on("click", "#dfaSubmitButton", (e) => {
    let str = getStringInput();
    runDFANodes(str);
    enableConvertNFAtoDFA(false);
})

$(document).on("click", "#nfaSubmitButton", (e) => {
    let str = getStringInput();
    runNFANodes(str);
    enableConvertNFAtoDFA(true);
})

export function enableConvertNFAtoDFA(bEnable): void {
    (<HTMLButtonElement>$("#convertNFAtoDFAButton")[0]).disabled = !bEnable;
}



$(document).on("click", "#convertNFAtoDFAButton", (e) => {
    clearEdges();

    let str = getStringInput();
    let nfaStartNode = runNFANodes(str);
    let dfa = Convert(nfaStartNode);
    console.log(dfa._isEndState);

    let dataSet = [];
    for (let node of allNodes) {
        let label = "q" + node._qState;
        if (node._isStartState)
            label += " (start)";
        else if (node._isEndState)
            label += " (accept)";

        dataSet.push({ id: node._qState, label: label });
    }

    var nodes = new vis.DataSet(dataSet);

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
});

$(document).on("click", "#convertREtoNFAButton", () => {
    clearDivs();
    initGlobals();

    let str = getRegexStringInput();
    let regex = new Regex(str);
    let nfa = regex.getNFA();

    let dataSet = createRegexDataSet(nfa);
    let edges = createRegexEdgeSet();

    var nodes = new vis.DataSet(dataSet);
    let set = new vis.DataSet(edges);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: set
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
});

export function createRegexDataSet(nfa: NFA): { id: number, label: string }[] {
    let dataSet: { id: number, label: string }[] = [];
    let startNum = nfa.initialState.num;

    for (let node of RENodes) {
        if (node.incoming.length < 1 && node.outgoing.length < 1) {
            continue;
        }
        else if (dataSet.findIndex(entry => entry.id === node.num) > -1) {
            continue;
        }
        else {
            let label = "q" + node.num;
            if (node.num === startNum)
                label += " (start)";
            if (node.isAccepting)
                label += " (accept)";

            dataSet.push({ id: node.num, label: label });
        }
    }

    for (let node of RENodes) {
        if (node.incoming.length < 1 && node.num !== 0) {
            node.AddIncoming({
                from: nfa.initialState,
                to: node,
                label: "Epsilon"
            });
        }
    }

    return dataSet;
}

export function createRegexEdgeSet(): { from: number, to: number, label: string }[] {
    let edges: { from: number, to: number, label: string }[] = [];

    for (let node of RENodes) {
        for (let link of node.outgoing.concat(node.incoming)) {
            if (edges.findIndex(entry =>
                entry.from === link.from.num &&
                entry.to === link.to.num &&
                entry.label === link.label) > -1) {
                continue;
            }
            else {
                edges.push({
                    from: link.from.num,
                    to: link.to.num,
                    label: link.label
                });
            }

        }
    }

    return edges;
}