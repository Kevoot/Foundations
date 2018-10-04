import { DFANodeOperation } from "./DFANodeOperation";
import { edgeList } from "./hw1";

export class DFANode {
    private _trueState: DFANode;
    private _falseState: DFANode;
    private _qState: number;
    public _isStartState: boolean;
    public _isEndState: boolean;
    private _operation: DFANodeOperation;

    constructor(qState: number, operation: DFANodeOperation, trueState?: DFANode, falseState?: DFANode, isStartState?: boolean, isEndState?: boolean) {
        this._qState = qState;
        this._operation = operation;

        if (trueState) {
            this._trueState = trueState;
            edgeList.push({ from: this._qState, to: trueState.GetQStateNumber(), label: "1" });
        }

        if (falseState) {
            this._falseState = falseState;
            edgeList.push({ from: this._qState, to: falseState.GetQStateNumber(), label: "0" });
        }

        if (isStartState) {
            this._isStartState = true;
        }

        if (isEndState) {
            this._isEndState = true;
        }
    }

    public IsStartState(): boolean {
        return this._isStartState;
    }

    public IsEndState(): boolean {
        return this._isEndState;
    }

    public SetTrueState(trueState: DFANode): void {
        if (!this._trueState && !(edgeList.find(
            entry => (entry.from === this._qState && entry.to === trueState.GetQStateNumber() && entry.label === 1)))) {
            edgeList.push({ from: this._qState, to: trueState.GetQStateNumber(), label: "1" });
        }
        else {
            let preexisting = edgeList.findIndex((entry) =>
                entry.from === this._qState && entry.to === this._trueState.GetQStateNumber() && entry.label === "1");
            if (preexisting > -1) {
                edgeList.splice(preexisting, 1);
            }
            edgeList.push({ from: this._qState, to: trueState.GetQStateNumber(), label: "1" });
        }
        this._trueState = trueState;
    }

    public GetTrueState(): DFANode {
        return this._trueState;
    }

    public SetFalseState(falseState: DFANode): void {
        if (!this._falseState && !(edgeList.find(
            entry => (entry.from === this._qState && entry.to === falseState.GetQStateNumber() && entry.label === 1)))) {
            edgeList.push({ from: this._qState, to: falseState.GetQStateNumber(), label: "0" });
        }
        else {
            let preexisting = edgeList.findIndex((entry) =>
                entry.from === this._qState && entry.to === this._falseState.GetQStateNumber() && entry.label === "0");
            if (preexisting > -1) {
                edgeList.splice(preexisting, 1);
            }
            edgeList.push({ from: this._qState, to: falseState.GetQStateNumber(), label: "0" });
        }
        this._falseState = falseState;
    }

    public GetFalseState(): DFANode {
        return this._falseState;
    }

    public HasState(state: DFANode | number | string): boolean {
        let stateNumber: number;
        if (state instanceof DFANode) {
            if (this._trueState === state || this._falseState === state)
                return true;
            else
                return false;
        }

        if (typeof state === "string")
            stateNumber = parseInt(state);
        else
            stateNumber = <number>state;

        if (this._trueState.GetQStateNumber() === stateNumber ||
            this._falseState.GetQStateNumber() === stateNumber)
            return true;
        else
            return false;
    }

    public GetQStateNumber(): number {
        return this._qState;
    }

    public SetQStateNumber(newNumber: number): void {
        this._qState = newNumber;
    }

    public MoveToNextState(str: string) {
        if (str.length > 0) {
            let result = this._operation.Execute(str);

            if (str.length === 1 && this.IsEndState()) {
                document.getElementById("outputStatesTravelled").innerHTML += " was accepted";
                return;
            }
            else if (str.length === 1 && this.IsEndState()) {
                document.getElementById("outputStatesTravelled").innerHTML += " was not accepted";
                return;
            }

            str = str.substr(1, str.length - 1);

            if (result) {
                document.getElementById("outputStatesTravelled").innerHTML +=
                    "Moving from state q" + this._qState + " to q" + this.GetTrueState().GetQStateNumber() + "\n";
                this.GetTrueState().MoveToNextState(str);
            }
            else {
                document.getElementById("outputStatesTravelled").innerHTML +=
                    "Moving from state q" + this._qState + " to q" + this.GetTrueState().GetQStateNumber() + "\n";
                this.GetFalseState().MoveToNextState(str);
            }
        }
        else {
            document.getElementById("outputStatesTravelled").innerHTML += "String was not accepted";
            return;
        }
    }
}