import { PerDayStatistics } from './per-day-statistics';
import { PerWeekStatistics } from './per-week-statistics';

export interface Statistics {
  days: Map<string, PerDayStatistics>;

  weeks: Map<string, PerWeekStatistics>;
}
