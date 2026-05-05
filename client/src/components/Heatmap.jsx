import { useState, useMemo } from 'react';
import styles from './Heatmap.module.css';

function Heatmap({ data = [] }) {
  const [tooltip, setTooltip] = useState(null);

  const { weeks, monthLabels } = useMemo(() => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const startDay = startDate.getDay();

    const dataMap = {};
    data.forEach(({ date, count }) => {
      dataMap[date] = count;
    });

    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }

    const endDate = new Date(year, 11, 31);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = dataMap[dateStr] || 0;
      currentWeek.push({ date: dateStr, count });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week.find(d => d !== null);
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ index: i, label: monthNames[month] });
          lastMonth = month;
        }
      }
    });

    return { weeks, monthLabels };
  }, [data]);

  const getLevel = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  };

  const formatTooltipDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.months}>
          {monthLabels.map(({ index, label }) => (
            <span
              key={label + index}
              className={styles.monthLabel}
              style={{ position: 'absolute', left: `${30 + index * 14}px` }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={styles.body} style={{ marginTop: '18px' }}>
          <div className={styles.dayLabels}>
            <span className={styles.dayLabel} style={{ visibility: 'hidden' }}>.</span>
            <span className={styles.dayLabel}>Mon</span>
            <span className={styles.dayLabel} style={{ visibility: 'hidden' }}>.</span>
            <span className={styles.dayLabel}>Wed</span>
            <span className={styles.dayLabel} style={{ visibility: 'hidden' }}>.</span>
            <span className={styles.dayLabel}>Fri</span>
            <span className={styles.dayLabel} style={{ visibility: 'hidden' }}>.</span>
          </div>
          <div className={styles.grid}>
            {weeks.map((week, wi) => (
              <div key={wi} className={styles.column}>
                {week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`${styles.cell} ${day ? styles[`level${getLevel(day.count)}`] : styles.level0}`}
                    onMouseEnter={() => day && setTooltip({ wi, di, ...day })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {tooltip && tooltip.wi === wi && tooltip.di === di && (
                      <div className={styles.cellTooltip}>
                        {formatTooltipDate(day.date)} — {day.count} movie{day.count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Heatmap;
