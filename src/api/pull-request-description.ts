import { IssueDescription } from './issue-description';

export interface PullRequestDescription extends IssueDescription {
  isMerged: boolean;
}
