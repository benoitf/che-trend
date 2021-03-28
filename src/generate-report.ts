import { inject, injectable } from 'inversify';

import { PerWeekStatistics } from './api/per-week-statistics';
import { Report } from './api/report';
import { Statistics } from './api/statistics';
import { TemplateGenerator } from './template/template-generator';

@injectable()
export class GenerateReport {
  @inject(TemplateGenerator)
  private templateGenerator: TemplateGenerator;

  public async generateRoadmapReport(statistics: Statistics): Promise<Report> {
    const roadmap = statistics.roadmap;

    const env = {
      roadmap,
    };

    const result = await this.templateGenerator.renderRoadmap(env);
    const report = { name: 'Roadmap', content: result, weekYear: '', weekNumber: '' };
    return report;
  }

  public async generateWeekReports(statistics: Statistics): Promise<Report[]> {
    const reports: Report[] = [];
    const perWeekIssuesAndPRsstatistics = statistics.weeks;

    await Promise.all(
      Array.from(perWeekIssuesAndPRsstatistics.keys()).map(async (weekInfo) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const statistics: PerWeekStatistics = perWeekIssuesAndPRsstatistics.get(weekInfo)!;
        const weekNumber = weekInfo.split('-')[1];
        const weekYear = weekInfo.split('-')[0];

        const env = {
          statistics,
          weekNumber,
          weekYear,
        };

        const result = await this.templateGenerator.renderWeekReport(env);

        const report = { name: weekInfo, content: result, weekYear, weekNumber };
        reports.push(report);
      })
    );

    return reports;
  }
}
