const apply: Record<Operator, (left: Maybe<number>, right: Maybe<number>) => Maybe<number>> = {
  plus: (left, right) => (left && right ? left + right : null),
  minus: (left, right) => (left && right && left > right ? left - right : null),
  times: (left, right) => (left && right && left !== 1 && right !== 1 ? left * right : null),
  divided: (left, right) =>
    left && right && right !== 1 && left % right === 0 ? left / right : null,
};

export default apply;
