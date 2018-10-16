import { NFANode } from "../NFA/NFANode";
import { NFANodeOperation } from "../NFA/NFANodeOperation";
import { DFANode } from "../DFA/DFANode";
import { DFANodeOperation } from "../DFA/DFANodeOperation";

export type State = {
    next: NFANode | DFANode;
    op: NFANodeOperation | DFANodeOperation;
}