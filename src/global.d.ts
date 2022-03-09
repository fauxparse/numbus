type Source = 'given' | 'calculated' | 'target';

type Operator = 'plus' | 'minus' | 'times' | 'divided';

type Side = 'left' | 'right';

type Card = {
  id: number;
  number: number;
  source: Source;
};

type Just<T> = T;

type Nothing = null;

type Maybe<T> = Nothing | Just<T>;

type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

type Row = Immutable<{
  left: Maybe<Card>;
  right: Maybe<Card>;
  operator: Maybe<Operator>;
  result: Maybe<Card>;
}>;

type State = Immutable<{
  seed: string;
  step: number;
  rows: Row[];
  cards: Maybe<Card>[];
  target: number;
  previous?: State;
  next?: State;
}>;

type Use = Immutable<{
  action: 'use';
  row: number;
  side: Side;
  card: Maybe<Card>;
}>;

type Unuse = Immutable<{
  action: 'unuse';
  card: Maybe<Card>;
}>;

type Operate = Immutable<{
  action: 'operate';
  row: number;
  operator: Maybe<Operator>;
}>;

type Undo = Immutable<{
  action: 'undo';
}>;

type Redo = Immutable<{
  action: 'redo';
}>;

type Action = Use | Unuse | Operate | Undo | Redo;

type Step = {
  left: number;
  right: number;
  operator: Operator;
  result: number;
};

type Solution = { steps: Step[] };
