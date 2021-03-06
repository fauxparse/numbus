import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import uniqueId from 'lodash/fp/uniqueId';
import Notice, { NoticeProps } from '.';

type NoticePromise = Promise<string | null>;

type NoticeHandle = NoticeProps & {
  id: string;
};

type NoticeHandles = Map<string, NoticeHandle>;

type NoticesContextShape = {
  notify: (props: Omit<NoticeProps, 'state'>) => NoticePromise;
};

type OpenAction = { type: 'open' } & NoticeHandle;

type CloseAction = { type: 'close'; id: string; button: string | null };

type ClosedAction = { type: 'closed'; id: string };

type NoticeAction = OpenAction | CloseAction | ClosedAction;

const NoticesContext = createContext<NoticesContextShape>({
  notify: (props) => Promise.resolve(null),
});

const Notices: React.FC = ({ children }) => {
  const [notices, dispatch] = useReducer(
    (state: NoticeHandles, { type, id, ...action }: NoticeAction) => {
      switch (type) {
        case 'open':
          return new Map(state).set(id, action as NoticeHandle);
        case 'close':
          const handle = state.get(id) as NoticeHandle;
          if (handle.onClose) handle.onClose((action as CloseAction).button);
          return new Map(state).set(id, { ...handle, state: 'closing' });
        case 'closed': {
          const map = new Map(state);
          map.delete(id);
          return map;
        }
        default:
          return state;
      }
    },
    null,
    () => new Map<string, NoticeHandle>()
  );

  const notify = useCallback((props: Omit<NoticeProps, 'state'>) => {
    const promise = new Promise<string | null>((onClose) => {
      dispatch({ type: 'open', ...props, id: uniqueId('notice'), state: 'open', onClose });
    });
    return promise;
  }, []);

  const anyOpen = useMemo<boolean>(() => {
    for (const { state } of notices.values()) {
      if (state === 'open') return true;
    }
    return false;
  }, [notices]);

  return (
    <NoticesContext.Provider value={{ notify }}>
      {children}
      <div className="notices" aria-hidden={!anyOpen || undefined}>
        {Array.from(notices.entries()).map(([id, notice]) => (
          <Notice
            key={id}
            {...notice}
            onClose={(button) => dispatch({ type: 'close', id, button })}
            onClosed={() => dispatch({ type: 'closed', id })}
          />
        ))}
      </div>
    </NoticesContext.Provider>
  );
};

export const useNotices = () => {
  const { notify } = useContext(NoticesContext);
  return notify;
};

export default Notices;
