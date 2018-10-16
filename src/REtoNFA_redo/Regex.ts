import { NFA } from "./NFA";

export class Regex {
    public regexStringArr: string[];

    constructor(str: string) {
        this.regexStringArr = str.split("");
    }

    public getNFA(): NFA {
        return this.createNFA(this.regexStringArr);
    }

    private createNFA(str: string[]): NFA {
        let nfa = new NFA();
        let prevChar = '0';
        let i = 0;
        let parensArr = [];

        let state = nfa.initialState;

        while (i < str.length) {
            if (str[i] === '(') {
                parensArr.push('(');
                let concatStr = "";
                let j = i + 1;
                while (true) {
                    if (str[j] === ')') {
                        parensArr.pop();
                        if (parensArr.length < 1) {
                            break;
                        }
                    } else if (str[j] === '(') {
                        parensArr.push('(');
                    }
                    if (!(parensArr.length < 1)) {
                        concatStr += str[j];
                    }
                    j++;
                }

                let subNFA = this.createNFA(concatStr.split(""));
                prevChar = concatStr;

                for(let link of subNFA.initialState.outgoing) {
                    nfa.currentState.AddOutgoing(link);
                }

                subNFA.initialState = undefined;
                i = j;
            }

            if(str[i] === "a" || str[i] === "b") {
                prevChar = str[i];
                nfa.handleConcat(str[i]);
            }
             else if (str[i] === '*') {

                nfa.handleKleene(prevChar);
            } else if (str[i] === '|') {

                state = nfa.handleUnion(state);

            }
            i++;
        }
        return nfa;
    }
}