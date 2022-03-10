import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Number, { NumberProps } from '.';
import { DropEvent } from '../Cell';

type DraggableProps = NumberProps;

gsap.registerPlugin(Draggable);

const THRESHOLD = '30%';

const DraggableNumber: React.FC<DraggableProps> = ({ id, number, source, onClick, ...props }) => {
  const [dragging, setDragging] = useState(false);

  const droppables = useRef<HTMLElement[]>([]);

  const droppable = useRef<HTMLElement | null>(null);

  const ref = useRef<HTMLButtonElement>(null);

  const dragInstance = useRef<Draggable[]>([]);

  const clickable = useRef(false);

  useEffect(() => {
    const draggable = Draggable.create(ref.current, {
      onPress() {
        clickable.current = true;
      },
      onDragStart() {
        clickable.current = false;
        droppables.current = [
          ref.current?.closest('.cell'),
          ...Array.from(document.querySelectorAll('[data-droppable]')),
        ] as HTMLElement[];
        setDragging(true);
      },
      onDrag() {
        if (droppable.current) {
          if (this.hitTest(droppable.current, THRESHOLD)) {
            return;
          } else {
            droppable.current.removeAttribute('data-dropping');
            droppable.current = null;
          }
        }

        for (const cell of droppables.current) {
          if (this.hitTest(cell, '50%')) {
            cell.setAttribute('data-dropping', 'true');
            droppable.current = cell;
            break;
          }
        }
      },
      onDragEnd() {
        if (droppable.current && id !== undefined) {
          const target = droppable.current;
          droppable.current = null;

          const sourceCell = ref.current?.closest('.cell') as HTMLElement;
          const sourceRect = sourceCell.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const card = { id, number, source } as Card;

          const { row, side } = target.dataset as { row?: string; side?: Side };
          const destination = row && side ? { row: parseInt(row, 10), side } : 'stock';

          gsap.to(ref.current, {
            x: targetRect.x - sourceRect.x,
            y: targetRect.y - sourceRect.y,
            duration: 0.15,
            onComplete: () => {
              const event: DropEvent = new CustomEvent('dropcard', {
                detail: { card, destination },
                bubbles: true,
              });
              target.dispatchEvent(event);
              target.removeAttribute('data-dropping');
            },
          });
        } else {
          gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.3,
          });
        }
        setDragging(false);
      },
      onClick(e) {
        if (onClick && clickable.current) {
          onClick(e);
        }
        clickable.current = false;
      },
    });

    dragInstance.current = draggable;
    return () => {
      draggable.forEach((d) => d.kill());
    };
  }, [onClick, id, number, source]);

  return (
    <Number
      ref={ref}
      id={id}
      key={id}
      number={number}
      source={source}
      data-dragging={dragging || undefined}
      {...props}
    />
  );
};

export default DraggableNumber;
