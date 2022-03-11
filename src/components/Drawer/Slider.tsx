import React, { ReactElement, useCallback, useState } from 'react';
import './Slider.scss';

const NUMBERS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

const label = (n: number, kind: string): ReactElement => (
  <>
    <b>{NUMBERS[n]}</b> {`${kind} one${n === 1 ? '' : 's'}`}
  </>
);

const MAX_BIG_ONES = 4;

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value, onChange }) => {
  const [over, setOver] = useState(false);

  const changed = useCallback(
    (e) => {
      const requested = parseInt(e.target.value, 10);
      setOver(requested > MAX_BIG_ONES);
      onChange(Math.min(requested, MAX_BIG_ONES));
    },
    [onChange]
  );

  return (
    <div className="slider" data-invalid={over || undefined}>
      <div>{label(value, 'big')}</div>
      <div onAnimationEnd={() => setOver(false)}>{label(6 - value, 'little')}</div>
      <input type="range" min={0} max={6} value={value} onChange={changed} />
    </div>
  );
};

export default Slider;
