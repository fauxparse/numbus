import clsx from 'clsx';
import gsap from 'gsap';
import React, { ComponentProps, useCallback, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Button from '../Button';
import './Notice.scss';

export type NoticeState = 'open' | 'closing';

export interface NoticeProps extends ComponentProps<'div'> {
  state: NoticeState;
  title: string;
  button: string;
  onClose?: () => void;
  onClosed?: () => void;
}

const Notice: React.FC<NoticeProps> = ({ state, title, button, onClose, onClosed, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClose) onClose();
    },
    [onClose]
  );

  useHotkeys('esc', close);

  useEffect(() => {
    switch (state) {
      case 'open':
        gsap.fromTo(
          ref.current,
          { translateY: '-75vh' },
          { translateY: 0, ease: 'elastic', duration: 1.5 }
        );
        gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        buttonRef.current?.focus();
        break;
      case 'closing':
        gsap.fromTo(
          ref.current,
          { translateY: 0 },
          {
            translateY: '100vh',
            rotate: '15deg',
            ease: 'power1.out',
            duration: 0.5,
            onComplete: onClosed,
          }
        );
    }
  }, [state, onClosed]);

  return (
    <div ref={ref} className={clsx('notice', `notice--${state}`)}>
      <h3 className="notice__title">{title}</h3>
      <div className="notice__content">{children}</div>
      <div className="notice__buttons">
        <Button ref={buttonRef} onClick={onClose}>
          {button}
        </Button>
      </div>
    </div>
  );
};

export default Notice;
