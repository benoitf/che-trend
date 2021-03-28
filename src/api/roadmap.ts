import { IssueDescription } from './issue-description';

export interface Roadmap {
  shortTermRoadmapIssues: IssueDescription[];
  midTermRoadmapIssues: IssueDescription[];
  longTermRoadmapIssues: IssueDescription[];
}
