import { IssueDescription } from './issue-description';
import { IssuesByArea } from './issue-by-area';
import { SortedArea } from './sorted-area';

export interface PerWeekStatistics {
  weekInfo: string;
  previousWeekInfo: string;

  percentNewIssuesFromPreviousWeek: string;
  percentNewIssuesFromPreviousWeekExternal: string;
  percentClosedIssuesFromPreviousWeek: string;

  percentNewPrsFromPreviousWeek: string;
  percentNewPrsFromPreviousWeekExternal: string;
  percentMergedPrsFromPreviousWeek: string;
  percentMergedPrsFromPreviousWeekExternal: string;

  totalNewIssues: number;
  totalNewIssuesEpics: number;
  totalNewIssuesPlanning: number;
  totalNewIssuesBugs: number;
  totalNewIssuesEnhancements: number;
  totalNewIssuesTasks: number;
  totalNewIssuesQuestions: number;

  totalClosedIssues: number;
  totalClosedIssuesEpics: number;
  totalClosedIssuesPlanning: number;
  totalClosedIssuesAuto: number;
  totalClosedIssuesBugs: number;
  totalClosedIssuesEnhancements: number;
  totalClosedIssuesTasks: number;
  totalClosedIssuesQuestions: number;

  totalNewPrs: number;
  totalNewPrsExternal: number;

  totalPrsMerged: number;
  totalPrsMergedExternal: number;

  issuesByAreas: Map<string, IssuesByArea>;
  sortedAreas: SortedArea[];

  newIssuesExternalContributions: IssueDescription[];
  closedIssuesExternalContributions: IssueDescription[];
  newPrsExternalContributions: IssueDescription[];
  mergedPrsExternalContributions: IssueDescription[];

  newIssuesNoteworthy: IssueDescription[];
  mergedPrsNoteworthy: IssueDescription[];
}
