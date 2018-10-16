export class DFANodeOperation {
    public _fn: Function;
    public _expected: string;
    constructor(fn: Function, expected: string) {
        this._fn = fn;
        this._expected = expected;
    }

    public Execute(input: string) {
        return this._fn(input.substr(0, 1), this._expected);
    }
}