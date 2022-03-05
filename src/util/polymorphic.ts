/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */

import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  JSXElementConstructor,
} from 'react';

export type PropsOf<C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<C, ComponentPropsWithoutRef<C>>;

export type AsProp<C extends ElementType> = {
  as?: C;
};

export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>;

export type InheritableElementProps<C extends ElementType, Props = {}> = ExtendableProps<
  Omit<PropsOf<C>, 'onChange'>,
  Props
>;

export type PolymorphicComponentProps<C extends ElementType, Props = {}> = InheritableElementProps<
  C,
  Props & AsProp<C>
>;

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

export type WithDisplayName<T> = T & { displayName?: string };
