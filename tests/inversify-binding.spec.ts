import 'reflect-metadata';

import { Analysis } from '../src/analysis';
import { ComputeStatistics } from '../src/process/compute-statistics';
import { Container } from 'inversify';
import { ExternalContributor } from '../src/issue/external-contributor';
import { GenerateReport } from '../src/generate-report';
import { GithubImport } from '../src/process/github-import';
import { InversifyBinding } from '../src/inversify-binding';
import { IssueDescriptionBuilder } from '../src/issue/issue-description-builder';
import { TemplateGenerator } from '../src/template/template-generator';
import { VuePressGenerator } from '../src/vuepress/vuepress-generator';

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
