import { inject, injectable } from 'inversify';

import { PerWeekStatistics } from './api/per-week-statistics';
import { Report } from './api/report';
import { Statistics } from './api/statistics';
import { TemplateGenerator } from './template/template-generator';

@injectable()
export class GenerateReport {
  @inject(TemplateGenerator)
  private templateGenerator: TemplateGenerator;

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

        const result = await this.templateGenerator.render(env);

        const report = { name: weekInfo, content: result, weekYear, weekNumber };
        reports.push(report);
      })
    );

    return reports;
  }
}
