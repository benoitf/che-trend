import * as moment from 'moment';

import { IssueDescription } from '../api/issue-description';
import { IssuesByArea } from '../api/issue-by-area';
import { PerDayStatistics } from '../api/per-day-statistics';
import { PerWeekStatistics } from '../api/per-week-statistics';
import { PullRequestDescription } from '../api/pull-request-description';
import { Roadmap } from '../api/roadmap';
import { SortedArea } from '../api/sorted-area';
import { Statistics } from '../api/statistics';
import { injectable } from 'inversify';

@injectable()
export class ComputeStatistics {
  private perWeekIssuesAndPRsstatistics: Map<string, PerWeekStatistics>;

  private issuesAndPRsstatistics: Map<string, PerDayStatistics>;

  private analyzed: Map<string, boolean>;

  private roadmap: Roadmap;

  constructor() {
    this.issuesAndPRsstatistics = new Map();
    this.perWeekIssuesAndPRsstatistics = new Map();
    this.analyzed = new Map();
    this.roadmap = this.initRoadmap();
  }

  protected initWeek(weekInfo: string, previousWeekInfo: string): PerWeekStatistics {
    return {
      weekInfo,
      previousWeekInfo,
      totalNewIssues: 0,
      totalNewIssuesEpics: 0,
      totalNewIssuesPlanning: 0,
      totalNewIssuesBugs: 0,
      totalNewIssuesEnhancements: 0,
      totalNewIssuesTasks: 0,
      totalNewIssuesQuestions: 0,

      totalClosedIssues: 0,
      totalClosedIssuesEpics: 0,
      totalClosedIssuesPlanning: 0,
      totalClosedIssuesAuto: 0,
      totalClosedIssuesBugs: 0,
      totalClosedIssuesEnhancements: 0,
      totalClosedIssuesTasks: 0,
      totalClosedIssuesQuestions: 0,

      totalNewPrs: 0,
      totalNewPrsExternal: 0,

      totalPrsMerged: 0,
      totalPrsMergedExternal: 0,

      issuesByAreas: new Map<string, IssuesByArea>(),
      sortedAreas: [],

      newIssuesExternalContributions: [],
      closedIssuesExternalContributions: [],
      newPrsExternalContributions: [],
      mergedPrsExternalContributions: [],

      newIssuesNoteworthy: [],
      mergedPrsNoteworthy: [],

      percentNewIssuesFromPreviousWeek: '',
      percentNewIssuesFromPreviousWeekExternal: '',
      percentClosedIssuesFromPreviousWeek: '',

      percentNewPrsFromPreviousWeek: '',
      percentNewPrsFromPreviousWeekExternal: '',
      percentMergedPrsFromPreviousWeek: '',
      percentMergedPrsFromPreviousWeekExternal: '',
    };
  }

  protected initRow(date: string): PerDayStatistics {
    return {
      date,
      newIssues: 0,
      newIssuesEpics: 0,
      newIssuesPlanning: 0,
      newIssuesBugs: 0,
      newIssuesEnhancements: 0,
      newIssuesTasks: 0,
      newIssuesQuestions: 0,

      closedIssues: 0,
      closedIssuesEpics: 0,
      closedIssuesPlanning: 0,
      closedIssuesAuto: 0,
      closedIssuesBugs: 0,
      closedIssuesEnhancements: 0,
      closedIssuesTasks: 0,
      closedIssuesQuestions: 0,

      prsOpen: 0,
      prsOpendExternal: 0,

      prsMerged: 0,
      prsMergedExternal: 0,

      newIssuesAreas: new Map<string, number>(),
      closeIssuesAreas: new Map<string, number>(),
    };
  }

  protected initRoadmap(): Roadmap {
    return {
      shortTermRoadmapIssues: [],
      midTermRoadmapIssues: [],
      longTermRoadmapIssues: [],
    };
  }

  protected getDayOrCreate(date: string): PerDayStatistics {
    let row: PerDayStatistics | undefined = this.issuesAndPRsstatistics.get(date);
    if (!row) {
      row = this.initRow(date);
      this.issuesAndPRsstatistics.set(date, row);
    }
    return row;
  }

  protected getWeekOrCreate(date: string): PerWeekStatistics {
    // transform date into week-info like 2020-2 for second week of 2020
    const momentDate = moment(date);
    const weekNumber = momentDate.isoWeeks();
    const year = momentDate.year();
    const weekInfo = `${year}-${weekNumber}`;

    const previousMomentDate = momentDate.subtract(7, 'days');
    const previousWeekNumber = previousMomentDate.isoWeeks();
    const previousYear = momentDate.year();
    const previousWeekInfo = `${previousYear}-${previousWeekNumber}`;

    let week: PerWeekStatistics | undefined = this.perWeekIssuesAndPRsstatistics.get(weekInfo);
    if (!week) {
      week = this.initWeek(weekInfo, previousWeekInfo);
      this.perWeekIssuesAndPRsstatistics.set(weekInfo, week);
    }
    return week;
  }

  protected handleNewIssues(issueDescription: IssueDescription): void {
    const row = this.getDayOrCreate(issueDescription.createdShortDate);
    const week = this.getWeekOrCreate(issueDescription.createdShortDateIso);

    // increment new Issue field
    row.newIssues++;
    week.totalNewIssues++;

    if (issueDescription.labels.includes('kind/epic')) {
      row.newIssuesEpics++;
      week.totalNewIssuesEpics++;
    }
    if (issueDescription.labels.includes('kind/planning')) {
      row.newIssuesPlanning++;
      week.totalNewIssuesPlanning++;
    }
    if (issueDescription.labels.includes('kind/bug')) {
      row.newIssuesBugs++;
      week.totalNewIssuesBugs++;
    }
    if (issueDescription.labels.includes('kind/enhancement')) {
      row.newIssuesEnhancements++;
      week.totalNewIssuesEnhancements++;
    }
    if (issueDescription.labels.includes('kind/task')) {
      row.newIssuesTasks++;
      week.totalNewIssuesTasks++;
    }
    if (issueDescription.labels.includes('kind/question')) {
      row.newIssuesQuestions++;
      week.totalNewIssuesQuestions++;
    }

    if (issueDescription.isExternal) {
      week.newIssuesExternalContributions.push(issueDescription);
    }

    issueDescription.areaLabels.forEach((areaLabel) => {
      const existingValue = week.issuesByAreas.get(areaLabel);
      if (!existingValue) {
        week.issuesByAreas.set(areaLabel, { opened: 1, closed: 0 });
      } else {
        existingValue.opened++;
      }

      const rowExistingValue = row.newIssuesAreas.get(areaLabel);
      if (!rowExistingValue) {
        row.newIssuesAreas.set(areaLabel, 1);
      } else {
        row.newIssuesAreas.set(areaLabel, rowExistingValue + 1);
      }
    });

    if (issueDescription.labels.includes('new&noteworthy')) {
      week.newIssuesNoteworthy.push(issueDescription);
    }

    if (issueDescription.labels.includes('roadmap/3-months')) {
      this.roadmap.shortTermRoadmapIssues.push(issueDescription);
    }

    if (issueDescription.labels.includes('roadmap/6-months')) {
      this.roadmap.midTermRoadmapIssues.push(issueDescription);
    }

    if (issueDescription.labels.includes('roadmap/1-year')) {
      this.roadmap.longTermRoadmapIssues.push(issueDescription);
    }
  }

  protected handleClosedIssues(issueDescription: IssueDescription): void {
    // not closed !
    if (!issueDescription.isClosed) {
      return;
    }
    const day = this.getDayOrCreate(issueDescription.closedShortDate);
    const week = this.getWeekOrCreate(issueDescription.closedShortDateIso);

    // increment closed Issue field
    day.closedIssues++;
    week.totalClosedIssues++;

    if (issueDescription.labels.includes('kind/epic')) {
      day.closedIssuesEpics++;
      week.totalClosedIssuesEpics++;
    }
    if (issueDescription.labels.includes('kind/planning')) {
      day.closedIssuesPlanning++;
      week.totalClosedIssuesPlanning++;
    }
    if (issueDescription.labels.includes('kind/bug')) {
      day.closedIssuesBugs++;
      week.totalClosedIssuesBugs++;
    }
    if (issueDescription.labels.includes('kind/enhancement')) {
      day.closedIssuesEnhancements++;
      week.totalClosedIssuesEnhancements++;
    }
    if (issueDescription.labels.includes('kind/task')) {
      day.closedIssuesTasks++;
      week.totalClosedIssuesTasks++;
    }
    if (issueDescription.labels.includes('kind/question')) {
      day.closedIssuesQuestions++;
      week.totalClosedIssuesQuestions++;
    }
    if (issueDescription.labels.includes('lifecycle/stale')) {
      day.closedIssuesAuto++;
      week.totalClosedIssuesAuto++;
    }

    issueDescription.areaLabels.forEach((areaLabel) => {
      const existingValue = week.issuesByAreas.get(areaLabel);
      if (!existingValue) {
        week.issuesByAreas.set(areaLabel, { opened: 1, closed: 0 });
      } else {
        existingValue.closed++;
      }

      const closedIssues = day.closeIssuesAreas.get(areaLabel);
      if (!closedIssues) {
        day.closeIssuesAreas.set(areaLabel, 1);
      } else {
        day.closeIssuesAreas.set(areaLabel, closedIssues + 1);
      }
    });

    if (issueDescription.isExternal) {
      week.closedIssuesExternalContributions.push(issueDescription);
    }
  }

  protected handleNewPRs(pullRequestDescription: PullRequestDescription): void {
    const day = this.getDayOrCreate(pullRequestDescription.createdShortDate);
    const week = this.getWeekOrCreate(pullRequestDescription.createdShortDateIso);

    day.prsOpen++;
    week.totalNewPrs++;

    if (pullRequestDescription.isExternal) {
      day.prsOpendExternal++;
      week.totalNewPrsExternal++;
      week.newPrsExternalContributions.push(pullRequestDescription);
    }
  }

  protected handleMergedPRs(pullRequestDescription: PullRequestDescription): void {
    // return if not merged
    if (!pullRequestDescription.isMerged) {
      return;
    }
    const day = this.getDayOrCreate(pullRequestDescription.closedShortDate);
    const week = this.getWeekOrCreate(pullRequestDescription.closedShortDateIso);

    day.prsMerged++;
    week.totalPrsMerged++;

    if (pullRequestDescription.isExternal) {
      day.prsMergedExternal++;
      week.totalPrsMergedExternal++;
      week.mergedPrsExternalContributions.push(pullRequestDescription);
    }

    if (pullRequestDescription.labels.includes('new&noteworthy')) {
      week.mergedPrsNoteworthy.push(pullRequestDescription);
    }
  }

  /**
   * Analyze the provided issues.
   */
  protected analyseIssues(issuesDescription: IssueDescription[]): void {
    issuesDescription.forEach((issueDescription) => {
      const key = `${issueDescription.repoOwner}/${issueDescription.repoName}/${issueDescription.number}`;
      if (this.analyzed.has(key)) {
        return;
      }

      // Manage issues
      if (issueDescription.isIssue) {
        this.handleNewIssues(issueDescription);
        this.handleClosedIssues(issueDescription);
      }

      // Manage PRS
      if (issueDescription.isPullRequest) {
        this.handleNewPRs(issueDescription as PullRequestDescription);
        this.handleMergedPRs(issueDescription as PullRequestDescription);
      }

      this.analyzed.set(key, true);
    });
  }

  protected percent(now: number, before: number): string {
    if (before === 0) {
      return `+${now}%`;
    }
    const diff = now / before;
    const percent = Math.round((diff - 1) * 100);
    if (percent >= 0) {
      return `+${percent}%`;
    } else {
      return `${percent}%`;
    }
  }

  protected computeWeekPercentages(): void {
    // iterate on each week and compare with previous week
    Array.from(this.perWeekIssuesAndPRsstatistics.keys()).forEach((weekInfo) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentWeek = this.perWeekIssuesAndPRsstatistics.get(weekInfo)!;
      const previousWeek = this.perWeekIssuesAndPRsstatistics.get(currentWeek.previousWeekInfo);
      // if no previous week, can't compute percentage
      if (previousWeek) {
        currentWeek.percentNewIssuesFromPreviousWeek = this.percent(
          currentWeek.totalNewIssues,
          previousWeek.totalNewIssues
        );
        currentWeek.percentNewIssuesFromPreviousWeekExternal = this.percent(
          currentWeek.newIssuesExternalContributions.length,
          previousWeek.newIssuesExternalContributions.length
        );
        currentWeek.percentClosedIssuesFromPreviousWeek = this.percent(
          currentWeek.totalClosedIssues,
          previousWeek.totalClosedIssues
        );
        currentWeek.percentNewPrsFromPreviousWeek = this.percent(currentWeek.totalNewPrs, previousWeek.totalNewPrs);
        currentWeek.percentNewPrsFromPreviousWeekExternal = this.percent(
          currentWeek.totalNewPrsExternal,
          previousWeek.totalNewPrsExternal
        );
        currentWeek.percentMergedPrsFromPreviousWeek = this.percent(
          currentWeek.totalPrsMerged,
          previousWeek.totalPrsMerged
        );
        currentWeek.percentMergedPrsFromPreviousWeekExternal = this.percent(
          currentWeek.totalPrsMergedExternal,
          previousWeek.totalPrsMergedExternal
        );
      }
    });
  }

  protected async removeOutdated(startDate: Date): Promise<void> {
    const start = moment(startDate);

    // drop all reports before start date
    Array.from(this.perWeekIssuesAndPRsstatistics.keys()).forEach((weekInfo) => {
      const extract = weekInfo.split('-');
      const year = parseInt(extract[0]);
      const week = parseInt(extract[1]);

      // delete
      if (year < start.year()) {
        this.perWeekIssuesAndPRsstatistics.delete(weekInfo);
        return;
      }
      if (year === start.year() && week < start.isoWeeks()) {
        this.perWeekIssuesAndPRsstatistics.delete(weekInfo);
        return;
      }
    });
  }

  protected sortAreas(): void {
    let longestArea = 0;
    // grab longest area
    Array.from(this.perWeekIssuesAndPRsstatistics.values()).forEach((week) => {
      Array.from(week.issuesByAreas.keys()).forEach((areaName) => {
        if (areaName.length > longestArea) {
          longestArea = areaName.length;
        }
      });
    });

    Array.from(this.perWeekIssuesAndPRsstatistics.keys()).forEach((weekInfo) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const week = this.perWeekIssuesAndPRsstatistics.get(weekInfo)!;

      const areas: SortedArea[] = [];
      Array.from(week.issuesByAreas.keys()).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const val = week.issuesByAreas.get(key)!;
        areas.push({
          name: key,
          // 2 extra dots
          formattedName: key.padEnd(longestArea + 1, '.'),
          opened: val.opened,
          closed: val.closed,
        });
      });

      // opened first, then sort by closed
      areas.sort((a, b) => {
        if (a.opened < b.opened) {
          return -1;
        } else if (a.opened > b.opened) {
          return 1;
        } else if (a.opened === b.opened) {
          if (a.closed < b.closed) {
            return -1;
          } else if (a.closed > b.closed) {
            return 1;
          } else if (a.closed === b.closed) {
            return 0;
          } else {
            return 0;
          }
        }
        return 0;
      });

      // highest score first
      week.sortedAreas = areas.reverse();
    });
  }

  public async compute(startDate: Date, issuesDescription: IssueDescription[]): Promise<Statistics> {
    // perform analyze of these issues to grab statistics
    this.issuesAndPRsstatistics.clear();
    this.perWeekIssuesAndPRsstatistics.clear();
    this.analyseIssues(issuesDescription);

    // cleanup
    await this.removeOutdated(startDate);

    // compute trends
    await this.computeWeekPercentages();

    // sort areas
    await this.sortAreas();

    return {
      weeks: this.perWeekIssuesAndPRsstatistics,
      days: this.issuesAndPRsstatistics,
      roadmap: this.roadmap,
    };
  }
}
