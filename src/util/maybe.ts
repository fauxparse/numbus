export type Nothing = null;

export type Just<T> = T;

export type Maybe<T> = Nothing | Just<T>;

export const isNothing = <T>(value: Maybe<T>): value is Nothing => value === null;

export const isJust = <T>(value: Maybe<T>): value is Just<T> => !isNothing(value);

export const maybe = <T>(value?: Maybe<T>): Maybe<T> => value ?? null;
