export interface Input {
  id: string;
  content: string;
  hasPair: boolean; // Flag to indicate whether it is uploaded as input-output pair.
  state: InputState;
}

export enum InputState {
  INITIAL,
  SELECTED,
  DONE,
}
