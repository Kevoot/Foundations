import { State } from "./State";

export type Link = {
    from: State;
    to: State;
    label: string;
}