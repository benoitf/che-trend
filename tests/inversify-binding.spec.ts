import 'reflect-metadata';
import { InversifyBinding } from '../src/inversify-binding';
import { Container } from 'inversify';
import { Analysis } from '../src/analysis';
import { VuePressGenerator } from '../src/vuepress/vuepress-generator';
import { TemplateGenerator } from '../src/template/template-generator';
import { ComputeStatistics } from '../src/process/compute-statistics';
import { GithubImport } from '../src/process/github-import';
import { GenerateReport } from '../src/generate-report';
import { IssueDescriptionBuilder } from '../src/issue/issue-description-builder';
import { ExternalContributor } from '../src/issue/external-contributor';


describe('Test InversifyBinding', () => {
  test('test bindings', async () => {
    const inversifyBinding = new InversifyBinding('foo');
    const container: Container = inversifyBinding.initBindings();

    expect(inversifyBinding).toBeDefined();

    expect(container.get(IssueDescriptionBuilder)).toBeDefined();
    expect(container.get(ExternalContributor)).toBeDefined();
    expect(container.get(ComputeStatistics)).toBeDefined();
    expect(container.get(GithubImport)).toBeDefined();
    expect(container.get(GenerateReport)).toBeDefined();
    expect(container.get(TemplateGenerator)).toBeDefined();
    expect(container.get(VuePressGenerator)).toBeDefined();

    const analysis = container.get(Analysis);
    expect(analysis).toBeDefined();
  });
});
