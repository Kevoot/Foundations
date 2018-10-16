import { DFANode } from "../DFA/DFANode";
import { NFANode } from "../NFA/NFANode";
import { DFANodeOperation } from "../DFA/DFANodeOperation";
import { State } from "../utils/Types";
import { NFANodeOperation } from "../NFA/NFANodeOperation";

export let allNodes: DFANode[];
export let nodeNums: number[];
export let endNum: number;
export let startNum: number;
let maxNum = 0;

export function Convert(nfaStartNode: NFANode): DFANode {
    allNodes = [];
    nodeNums = [];
    let startNode = ConvertNode(nfaStartNode);
    startNode._isEndState = false;
    startNode._isStartState = true;

    // Renumber
    let maxQStateNum = 0;
    for(let node of allNodes) {
        if(node._qState > maxQStateNum)
            maxQStateNum = node._qState;
    }

    for (let node of allNodes) {
        if(node.IsEndState) {
            endNum = node._qState;
        }

        if(node.IsStartState) {
            startNum = node._qState;
        }
    }

    return startNode;
}

export function ConvertNode(nfaNode: NFANode): DFANode {
    let convNode: DFANode;
    let followNodes: { next: NFANode | DFANode, op: NFANodeOperation | DFANodeOperation }[] = [];
    let firstFollow: DFANode;

    for (let node of nfaNode._nextStates) {
        if (node.next === nfaNode) {
            continue;
        }
        else if ((<NFANodeOperation>node.op)._isEpsilon) {
            let convChild = ConvertEpsilon(<NFANode>node.next);
            for (let child of convChild) {
                followNodes.push({ next: ConvertNode(<NFANode>child.next), op: child.op });
            }
        }
        else followNodes.push({ next: ConvertNode(<NFANode>node.next), op: node.op });
    }

    convNode = new DFANode(nfaNode._qState, undefined, nfaNode._isStartState, nfaNode._isEndState);

    if(nodeNums.findIndex(entry => entry === convNode._qState)) {
        convNode._qState = findMaxQStateNum() + 1;
    }

    nodeNums.push(convNode._qState);

    for (let node of followNodes) {
        convNode.AddState({ next: node.next, op: node.op });
    }

    allNodes.push(convNode);
    return convNode;
}

export function ConvertEpsilon(nfaNode: NFANode): State[] {
    let nextNodes: State[] = [];

    for (let node of nfaNode._nextStates) {
        if ((<NFANodeOperation>node.op)._isEpsilon) {
            ConvertEpsilon(<NFANode>node.next).forEach(entry => nextNodes.push(entry));
        }
        else {
            nextNodes.push(node);
        }
    }

    return nextNodes;
}

export function findMaxQStateNum(): number {
    let max = 0;
    for(let val of nodeNums) {
        if(val > max) {
            max = val;
        }
    }
    return max;
}