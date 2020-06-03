export interface PerDayStatistics {
  date: string;

  newIssues: number;
  newIssuesEpics: number;
  newIssuesPlanning: number;
  newIssuesBugs: number;
  newIssuesEnhancements: number;
  newIssuesTasks: number;
  newIssuesQuestions: number;

  closedIssues: number;
  closedIssuesEpics: number;
  closedIssuesPlanning: number;
  closedIssuesAuto: number;
  closedIssuesBugs: number;
  closedIssuesEnhancements: number;
  closedIssuesTasks: number;
  closedIssuesQuestions: number;

  prsOpen: number;
  prsOpendExternal: number;

  prsMerged: number;
  prsMergedExternal: number;

  newIssuesAreas: Map<string, number>;
  closeIssuesAreas: Map<string, number>;
}
