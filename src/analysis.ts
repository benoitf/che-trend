import { inject, injectable } from 'inversify';

import { ComputeStatistics } from './process/compute-statistics';
import { GenerateReport } from './generate-report';
import { GithubImport } from './process/github-import';
import { IssueDescription } from './api/issue-description';
import { VuePressGenerator } from './vuepress/vuepress-generator';

@injectable()
export class Analysis {
  @inject(ComputeStatistics)
  private computeStatistics: ComputeStatistics;

  @inject(GithubImport)
  private githubImport: GithubImport;

  @inject(GenerateReport)
  private generateReport: GenerateReport;

  @inject(VuePressGenerator)
  private vuePressGenerator: VuePressGenerator;

  async analyze(startDate: Date): Promise<void> {
    const issueDescriptions: IssueDescription[] = await this.githubImport.import(startDate);
    const statistics = await this.computeStatistics.compute(startDate, issueDescriptions);
    const reports = await this.generateReport.generateWeekReports(statistics);
    await this.vuePressGenerator.generate(reports);
  }
}
