import { createContext, forwardRef, useContext } from 'react';
import { DrawerContext } from '../Drawer';
import './Header.scss';

export const HeaderButtonContext = createContext<HTMLDivElement | null>(null);

const Header = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { expanded, toggle } = useContext(DrawerContext);

  return (
    <header className="header" {...props}>
      <h1>Numbus</h1>
      <button
        className="menu-button"
        aria-label="Menu"
        aria-pressed={expanded || undefined}
        onClick={toggle}
      >
        <svg viewBox="-12 -12 24 24">
          <g>
            <circle cx={0} cy={0} r={4} />
            <circle cx={0} cy={0} r={4} />
            <circle cx={0} cy={0} r={4} />
          </g>
        </svg>
      </button>
      <div className="header__buttons" ref={ref} />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
