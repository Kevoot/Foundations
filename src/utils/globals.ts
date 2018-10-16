import { NFA } from "../REtoNFA_redo/NFA";
import { State } from "../REtoNFA_redo/State";

export let nodeNums: number[];
export let RENodes: State[];
export let REEdgeList: any[];

export function initGlobals(): void {
    clearNodeNums();
    clearRENodes();
    clearREEdgeList();
}

export function clearNodeNums(): void {
    nodeNums = [];
}

export function clearRENodes(): void {
    RENodes = [];
}

export function clearREEdgeList(): void {
    REEdgeList = [];
}

export function findNextQStateNum(): number {
    let max = 0;
    if(nodeNums.length <= 1)
        max;
    for(let val of nodeNums) {
        if(val > max) {
            max = val;
        }
    }
    return max + 1;
}

export function AddRENode(state: State) {
    RENodes.push(state);
}