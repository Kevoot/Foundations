export class NFANodeOperation {
    public _fn: Function;
    public _expected: string;
    public _isEpsilon: boolean;

    constructor(fn: Function, expected: string, isEpsilon?: boolean) {
        this._fn = fn;
        this._expected = expected;
        if(isEpsilon) 
            this._isEpsilon = true;
        else
            this._isEpsilon = false;
    }

    public Execute(input: string) {
        if(this._isEpsilon)
            return true;
        else
            return this._fn(input.substr(0, 1), this._expected);
    }
}