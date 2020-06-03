export interface IssueDescription {
  url: string;
  number: number;
  authorLogin: string;
  authorUrl: string;
  title: string;
  repoOwner: string;
  repoName: string;
  isPullRequest: boolean;
  isExternal: boolean;
  isIssue: boolean;
  labels: string[];
  createdShortDate: string;
  createdShortDateIso: string;
  isClosed: boolean;
  isOpen: boolean;
  closedShortDate: string;
  closedShortDateIso: string;
  areaLabels: string[];
  kindLabels: string[];
}
