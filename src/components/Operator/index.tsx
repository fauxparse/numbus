import React, {
  ComponentPropsWithoutRef,
  MutableRefObject,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import './Operator.scss';

const CLICK_TIMEOUT = 300;

export enum Operation {
  Add = 'add',
  Subtract = 'subtract',
  Multiply = 'multiply',
  Divide = 'divide',
}

export const ICONS: Record<Operation, ReactElement> = {
  [Operation.Add]: (
    <g>
      <rect x={-14} y={-4} width={28} height={8} rx={2} />
      <rect x={-4} y={-14} width={8} height={28} rx={2} />
    </g>
  ),
  [Operation.Subtract]: (
    <g>
      <rect x={-14} y={-4} width={28} height={8} rx={2} />
    </g>
  ),
  [Operation.Multiply]: (
    <g transform="rotate(45)">
      <rect x={-14} y={-4} width={28} height={8} rx={2} />
      <rect x={-4} y={-14} width={8} height={28} rx={2} />
    </g>
  ),
  [Operation.Divide]: (
    <g>
      <rect x={-14} y={-4} width={28} height={8} rx={2} />
      <rect x={-4} y={-14} width={8} height={8} rx={2} />
      <rect x={-4} y={6} width={8} height={8} rx={2} />
    </g>
  ),
};

const OPERATORS = Object.values(Operation) as Operation[];

export interface OperatorProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  operation?: Operation;
  onChange?: (operation: Operation | null) => void;
}

function useConfirmable<T>(
  value: T,
  onChange?: (value: T) => void
): { value: T; setValue: (newValue: T, force?: boolean) => void; confirm: () => void } {
  const internal = useRef<T>(value);

  const [state, setState] = useState<T>(value);

  useEffect(() => {
    setState(internal.current);
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

const Operator: React.FC<OperatorProps> = ({ className, operation, onChange, ...props }) => {
  const ref = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;

  const {
    value: hovered,
    setValue: setHovered,
    confirm,
  } = useConfirmable<Operation | null>(operation || null, onChange);

  const mouseTimer = useRef<ReturnType<typeof setTimeout>>();

  const touchTimer = useRef<ReturnType<typeof setTimeout>>();

  const cursorMoved = useCallback(
    (clientX: number, clientY: number) => {
      const { top, right, bottom, left } = ref.current.getBoundingClientRect();
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const u = clientX < cx ? 0 : 1;
      const v = clientY < cy ? 0 : 1;
      const op = OPERATORS[v * 2 + u];
      setHovered(op || null);
    },
    [setHovered]
  );

  const mouseMove = useCallback(
    (e) => {
      const { clientX, clientY } = e;
      cursorMoved(clientX, clientY);
    },
    [cursorMoved]
  );

  const mouseUp = useCallback(() => {
    ref.current.removeAttribute('data-active');
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
    if (mouseTimer.current) clearTimeout(mouseTimer.current);
    confirm();
  }, [mouseMove, confirm]);

  const mouseDown = useCallback(() => {
    mouseTimer.current = setTimeout(() => {
      ref.current.setAttribute('data-active', 'true');
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
    ref.current.removeAttribute('data-active');
    window.removeEventListener('touchmove', touchMove);
    window.removeEventListener('touchend', touchEnd);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    confirm();
  }, [touchMove, confirm]);

  const touchStart = useCallback(
    (e) => {
      touchTimer.current = setTimeout(() => {
        ref.current.setAttribute('data-active', 'true');
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
    const el = ref.current;
    el.addEventListener('touchstart', touchStart);
    el.addEventListener('contextmenu', blockContextMenu);
    return () => {
      el.removeEventListener('touchstart', touchStart);
      el.removeEventListener('contextmenu', blockContextMenu);
    };
  }, [touchStart, blockContextMenu]);

  const clicked = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!(e.target as HTMLElement).closest('[data-active]')) {
        setHovered(
          OPERATORS[(OPERATORS.indexOf(hovered as Operation) + 1) % OPERATORS.length],
          true
        );
      }
    },
    [setHovered, hovered]
  );

  return (
    <button
      ref={ref}
      className={clsx('operator', className)}
      data-operator={operation}
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
    </button>
  );
};

export default Operator;
