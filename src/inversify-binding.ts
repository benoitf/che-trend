import 'reflect-metadata';

import { Analysis } from './analysis';
import { ComputeStatistics } from './process/compute-statistics';
import { Container } from 'inversify';
import { ExternalContributor } from './issue/external-contributor';
import { GenerateReport } from './generate-report';
import { GithubImport } from './process/github-import';
import { IssueDescriptionBuilder } from './issue/issue-description-builder';
import { TemplateGenerator } from './template/template-generator';
import { VuePressGenerator } from './vuepress/vuepress-generator';

export class InversifyBinding {
  private container: Container;

  constructor(private githubReadToken: string) {}

  public initBindings(): Container {
    this.container = new Container();

    this.container.bind(ComputeStatistics).toSelf().inRequestScope();
    this.container.bind(GithubImport).toSelf().inSingletonScope();
    this.container.bind(GenerateReport).toSelf().inSingletonScope();
    this.container.bind(VuePressGenerator).toSelf().inSingletonScope();
    this.container.bind(TemplateGenerator).toSelf().inSingletonScope();
    this.container.bind(IssueDescriptionBuilder).toSelf().inSingletonScope();
    this.container.bind(ExternalContributor).toSelf().inSingletonScope();

    // token
    this.container.bind('string').toConstantValue(this.githubReadToken).whenTargetNamed('GRAPHQL_AUTHORIZATION');

    // Analyze
    this.container.bind(Analysis).toSelf().inSingletonScope();

    return this.container;
  }
}
