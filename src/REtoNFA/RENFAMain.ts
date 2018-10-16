import { NFANode } from "../NFA/NFANode";
import { NFANodeOperation } from "../NFA/NFANodeOperation";
import { State } from "../utils/Types";
import { clearNodeNums, nodeNums } from "../utils/globals";

export let nodeConnections: {from: NFANode, to: NFANode}[];

let endNums: number[];
let startNums: number[];
let maxNum = 0;
export let RENodes: NFANode[];

let compare = function (str: string, char: string) {
    if(str === char)
        return true;
    else
        return false;
}

/**
 * 
 * @param str We want a to identify the operations and register each operation
 */
export function processRegex(str: string) {
    clearNodeNums();
    RENodes = [];
    let node = processRegexArray(str.split(""));
    node.node._isStartState = true;
    let test = 0;
}

function processRegexArray(str: string[]): { node: NFANode, newIndex?: number } {
    // Handle parens separately 
    // (We want the next matching parens, unless another left comes before the right)

    let prev;

    let nodeNum = findMaxQStateNum();
    let currentNFA = new NFANode(nodeNum, undefined, undefined, undefined);
    nodeNums.push(nodeNum);
    RENodes.push(currentNFA);

    for(let i = 0; i < str.length; ) {
        if(i > 0)
            prev = str[i - 1];

        if(str[i] === "(") {
            let subArr = str.slice(i + 1);
            let next = processRegexArray(subArr);
            i = next.newIndex;
            let op = new NFANodeOperation(compare, "", true);
            currentNFA.AddState({next: next.node, op: op});
        }
        else if(str[i] === ")") {
            return { node: currentNFA, newIndex: i + 1};
        }
        else if(str[i] === "*") {
            processKleene(currentNFA, prev);
            i++;
        }
        else if(str[i] === "|") {
            processUnion(currentNFA, str.slice(i + 1, str.length - 1));
            i++;
        }
        else {
            processChar(currentNFA, str[i]);
            i++;
        }

    }

    return { node: currentNFA};
}

function processChar(parentNode: NFANode, str: string): NFANode {
    let nodeNum;
    nodeNums.push(nodeNum);
    let node = new NFANode(nodeNum, undefined, undefined, undefined);
    RENodes.push(node);

    let op = new NFANodeOperation(compare, str, str === "" ? true : false);

    parentNode.AddState({next: node, op: op});
    return parentNode;
}

function processUnion(parentNode: NFANode, str: string[]): void {
    let node = processRegexArray(str);
    let op = new NFANodeOperation(compare, "", true);

    for(let parent of parentNode._parentStates) {
        parent._nextStates.push({next: node.node, op: op});
    }
    
}

function processKleene(parentNode: NFANode, str: string): void {
    let op = new NFANodeOperation(compare, str, false);
    parentNode.AddState({next: parentNode, op: op});
}

export function findMaxQStateNum(): number {
    let max = 0;
    for(let val of nodeNums) {
        if(val > max) {
            max = val;
        }
    }
    return max + 1;
}
