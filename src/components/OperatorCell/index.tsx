import React, {
  ElementType,
  forwardRef,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import mergeRefs from 'react-merge-refs';
import { PolymorphicComponentProps, PolymorphicRef, WithDisplayName } from '../../util/polymorphic';
import Cell from '../Cell';
import { Operator, OPERATORS } from '../../util/operators';
import './Operator.scss';
import { Maybe } from '../../util/maybe';

const CLICK_TIMEOUT = 200;

export const ICONS: Record<Operator, ReactElement> = {
  [Operator.Add]: (
    <g>
      <rect x={-12} y={-3} width={24} height={6} rx={2} />
      <rect x={-3} y={-12} width={6} height={24} rx={2} />
    </g>
  ),
  [Operator.Subtract]: (
    <g>
      <rect x={-12} y={-3} width={24} height={6} rx={2} />
    </g>
  ),
  [Operator.Multiply]: (
    <g transform="rotate(45)">
      <rect x={-12} y={-3} width={24} height={6} rx={2} />
      <rect x={-3} y={-12} width={6} height={24} rx={2} />
    </g>
  ),
  [Operator.Divide]: (
    <g>
      <rect x={-12} y={-3} width={24} height={6} rx={2} />
      <rect x={-3} y={-12} width={6} height={6} rx={2} />
      <rect x={-3} y={6} width={6} height={6} rx={2} />
    </g>
  ),
};

interface BaseOperatorCellProps {
  operator: Maybe<Operator>;
  onChange?: (operator: Maybe<Operator>) => void;
}

export type OperatorCellProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  BaseOperatorCellProps
>;

export type OperatorCellComponent = WithDisplayName<
  <C extends ElementType = 'button'>(props: OperatorCellProps<C>) => Maybe<ReactElement>
>;

function useConfirmable<T>(
  value: T,
  onChange?: (value: T) => void
): { value: T; setValue: (newValue: T, force?: boolean) => void; confirm: () => void } {
  const internal = useRef<T>(value);

  const [state, setState] = useState<T>(value);

  useEffect(() => {
    setState(value);
  }, [value]);

  const setter = useRef<(value: T) => void>(() => {});

  useEffect(() => {
    internal.current = state;
  }, [state]);

  useEffect(() => {
    setter.current = (newValue: T) => {
      if (newValue !== internal.current) {
        setState(newValue);
      }
    };
  }, []);

  const confirm = useCallback(() => {
    if (onChange && internal.current !== value) onChange(internal.current);
  }, [onChange, value]);

  const setValue = useCallback(
    (newValue: T, force?: boolean) => {
      if (force) {
        internal.current = newValue;
        setState(newValue);
        if (onChange) onChange(newValue);
      } else {
        setter.current(newValue);
      }
    },
    [onChange]
  );

  return { value: state, setValue, confirm };
}

const OperatorCell: OperatorCellComponent = forwardRef(
  <T extends ElementType = 'button'>(
    { className, operator, onChange, ...props }: OperatorCellProps<T>,
    ref: PolymorphicRef<T>
  ) => {
    const ownRef = useRef<HTMLButtonElement>();

    const {
      value: hovered,
      setValue: setOperator,
      confirm,
    } = useConfirmable<Operator | null>(operator || null, onChange);

    const mouseTimer = useRef<ReturnType<typeof setTimeout>>();

    const touchTimer = useRef<ReturnType<typeof setTimeout>>();

    const clicked = useCallback(() => {
      if (!ownRef.current?.closest('[data-active]')) {
        setOperator(
          OPERATORS[(OPERATORS.indexOf(operator as Operator) + 1) % OPERATORS.length],
          true
        );
      }
    }, [setOperator, operator]);

    const cursorMoved = useCallback(
      (clientX: number, clientY: number) => {
        if (!ownRef?.current) return;
        const { top, right, bottom, left } = ownRef.current.getBoundingClientRect();
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        const u = clientX < cx ? 0 : 1;
        const v = clientY < cy ? 0 : 1;
        const op = OPERATORS[v * 2 + u];
        setOperator(op || null);
      },
      [setOperator]
    );

    const mouseMove = useCallback(
      (e) => {
        const { clientX, clientY } = e;
        cursorMoved(clientX, clientY);
      },
      [cursorMoved]
    );

    const mouseUp = useCallback(() => {
      setTimeout(() => {
        if (!ownRef?.current) return;
        ownRef.current.removeAttribute('data-active');
      });
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      if (mouseTimer.current) clearTimeout(mouseTimer.current);
      confirm();
    }, [mouseMove, confirm]);

    const mouseDown = useCallback(() => {
      mouseTimer.current = setTimeout(() => {
        if (!ownRef?.current) return;
        ownRef.current.setAttribute('data-active', 'true');
        window.addEventListener('mousemove', mouseMove);
      }, CLICK_TIMEOUT);
      window.addEventListener('mouseup', mouseUp);
    }, [mouseMove, mouseUp]);

    const touchMove = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const [{ clientX, clientY }] = e.changedTouches;
        cursorMoved(clientX, clientY);
      },
      [cursorMoved]
    );

    const touchEnd = useCallback(() => {
      if (!ownRef?.current) return;
      ownRef.current.removeAttribute('data-active');
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      if (touchTimer.current) clearTimeout(touchTimer.current);
      confirm();
    }, [touchMove, confirm]);

    const touchStart = useCallback(
      (e) => {
        touchTimer.current = setTimeout(() => {
          if (!ownRef?.current) return;
          touchTimer.current = undefined;
          ownRef.current.setAttribute('data-active', 'true');
          window.addEventListener('touchmove', touchMove, { passive: false });
        }, CLICK_TIMEOUT);
        window.addEventListener('touchend', touchEnd);
      },
      [touchMove, touchEnd]
    );

    const blockContextMenu = useCallback((e) => {
      e.preventDefault();
    }, []);

    useEffect(() => {
      if (!ownRef?.current) return;
      const el = ownRef.current;
      el.addEventListener('touchstart', touchStart);
      el.addEventListener('contextmenu', blockContextMenu);
      return () => {
        el.removeEventListener('touchstart', touchStart);
        el.removeEventListener('contextmenu', blockContextMenu);
      };
    }, [touchStart, blockContextMenu]);

    return (
      <Cell
        as="button"
        ref={mergeRefs([ref, ownRef])}
        className={clsx('operator', className)}
        data-operator={operator}
        onMouseDown={mouseDown}
        onClick={clicked}
        {...props}
      >
        <svg viewBox="-36 -36 72 72">
          {OPERATORS.map((op, i) => (
            <g
              key={op}
              transform={`translate(${(i % 2) * 36 - 18}, ${Math.floor(i / 2) * 36 - 18})`}
              data-operator={op}
              data-hover={op === hovered ? 'true' : undefined}
            >
              <rect x={-18} y={-18} width={36} height={36} rx={4} />
              {ICONS[op]}
            </g>
          ))}
        </svg>
      </Cell>
    );
  }
);

OperatorCell.displayName = 'Operator';

export default OperatorCell;
