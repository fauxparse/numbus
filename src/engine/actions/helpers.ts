export const insertAtFirstBlank = <T>(
  items: Immutable<Maybe<T>[]>,
  item: T
): Immutable<Maybe<T>[]> => {
  const index = items.findIndex((t) => !t);
  return index < 0 ? [...items, item] : items.map((t, i) => (i === index ? item : t));
};

export const blankRow = (): Row => ({ left: null, operator: null, right: null, result: null });
