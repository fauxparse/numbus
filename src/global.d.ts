type Source = 'given' | 'calculated';

type Operator = 'plus' | 'minus' | 'times' | 'divided';

type Side = 'left' | 'right';

type ID = number;

type Card = {
  id: ID;
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
  id: ID;
  rows: Row[];
  cards: Maybe<Card>[];
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
