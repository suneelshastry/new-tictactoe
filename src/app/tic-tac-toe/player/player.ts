export interface player {
    symbol: string;
    type: string;
    opponent: player;
    winner: boolean;
    name: string;
}

export class HumanPlayer implements player {
    type: string = "Human";
    winner: boolean = false;
    constructor(public name: string, public symbol: string, public opponent) {
    }
}

export class ComputerPlayer implements player {
    type: string = "Computer";
    winner: boolean = false;
    name: string = "Computer";
    constructor(public symbol: string, public opponent) {
    }
}