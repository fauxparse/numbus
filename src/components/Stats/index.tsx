import React, {
  createContext,
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import './Stats.scss';

const LOCAL_STORAGE_KEY = 'numbus.statistics';

export enum Statistic {
  Solo = 'solo',
  Assisted = 'assisted',
  Abandoned = 'abandoned',
}

const LABELS: Record<Statistic, string> = {
  solo: 'Unaided',
  assisted: 'With hints',
  abandoned: 'Abandoned',
};

type Statistics = {
  [key in Statistic]: number;
};

const Stats: React.FC<Statistics> = (props) => {
  return (
    <div className="stats">
      {Object.values(Statistic).map((stat) => (
        <div key={stat} className="stats__number" data-stat={stat}>
          <b>{props[stat]}</b>
          <span>{LABELS[stat]}</span>
        </div>
      ))}
      <div className="stats__bar">
        {Object.values(Statistic).map((stat) => (
          <span
            key={stat}
            className="stats__stat"
            data-stat={stat}
            style={{ '--value': props[stat] } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};

type StatsContextShape = { stats: Statistics; increment: (stat: Statistic) => void };

const emptyStats: Statistics = { solo: 0, assisted: 0, abandoned: 0 };

const StatsContext = createContext<StatsContextShape>({
  stats: emptyStats,
  increment: () => {},
});

export const StatsProvider: React.FC = ({ children }) => {
  const [stats, setStats] = useState(() => {
    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localStorageValue ? JSON.parse(localStorageValue) : emptyStats;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const increment = useCallback(
    (stat: Statistic): void => {
      setStats((current: Statistics | undefined) => ({
        ...(current || emptyStats),
        [stat]: ((current && current[stat]) || 0) + 1,
      }));
    },
    [setStats]
  );

  return (
    <StatsContext.Provider value={{ stats: stats as Statistics, increment }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStatistics = (): [Statistics, (stat: Statistic) => void] => {
  const { stats, increment } = useContext(StatsContext);

  return [stats, increment];
};

export default Stats;
