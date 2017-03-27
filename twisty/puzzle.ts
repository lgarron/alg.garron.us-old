"use strict";

namespace Twisty {

export type MoveName = string

export interface MoveProgress {
  moveName: MoveName
  fraction: number
}

export interface State<Puzzle> {
}

export abstract class Puzzle {
  abstract startState(): State<Puzzle>
  abstract invert(state: State<Puzzle>): State<Puzzle>
  abstract combine(s1: State<Puzzle>, s2: State<Puzzle>): State<Puzzle>
  multiply(state: State<Puzzle>, amount: number): State<Puzzle> {
    if (amount < 0) {
      return this.invert(this.multiply(state, -amount));
    }

    var newState = this.startState();
    for(var i = 0; i < amount; i++) {
      newState = this.combine(newState, state);
    }
    return newState;
  }
  abstract stateFromMove(moveName: MoveName): State<Puzzle>
  abstract equivalent(s1: State<Puzzle>, s2: State<Puzzle>): boolean
}

interface KSolve333PuzzleState extends KSolve.Transformation, State<KSolve333Puzzle> {
}

var threeDef = KSolve.Puzzles["333"];
export class KSolve333Puzzle extends Puzzle {
  startState(): KSolve333PuzzleState {
    return threeDef.startPieces;
  }
  invert(state: KSolve333PuzzleState): KSolve333PuzzleState {
    return KSolve.Invert(threeDef, state);
  }
  combine(s1: KSolve333PuzzleState, s2: KSolve333PuzzleState): KSolve333PuzzleState {
    return KSolve.Combine(threeDef, s1, s2);
  }
  stateFromMove(moveName: MoveName): KSolve333PuzzleState {
     var state = threeDef.moves[moveName];
     if (!state) {
       throw `Unknown move: ${moveName}`;
     }
     return state;
  }
  equivalent(s1: KSolve333PuzzleState, s2: KSolve333PuzzleState): boolean {
    return KSolve.EquivalentStates(threeDef, s1, s2);
  }
}


class QTMCounterState implements State<QTMCounterPuzzle> {
  constructor(public value: number) {}
}

export class QTMCounterPuzzle extends Puzzle {
  startState(): QTMCounterState {
    return new QTMCounterState(0);
  }
  invert(state: QTMCounterState): QTMCounterState {
    return new QTMCounterState(-state.value);
  }
  combine(s1: QTMCounterState, s2: QTMCounterState): QTMCounterState {
    return new QTMCounterState(s1.value + s2.value);
  }
  stateFromMove(moveName: MoveName): QTMCounterState {
    return new QTMCounterState(1);
  }
  equivalent(s1: QTMCounterState, s2: QTMCounterState): boolean {
    return s1.value === s2.value;
  }
}


}
