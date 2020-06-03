import 'reflect-metadata';

import { Analysis } from '../src/analysis';
import { Container } from 'inversify';
import { mock, instance, verify, anyOfClass, anything, capture } from 'ts-mockito';
import { ComputeStatistics } from '../src/process/compute-statistics';
import { GithubImport } from '../src/process/github-import';
import { GenerateReport } from '../src/generate-report';
import { VuePressGenerator } from '../src/vuepress/vuepress-generator';

describe('Test Analysis', () => {
  let container: Container;

 let  mockedComputeStatistics: ComputeStatistics;
let mockedGithubImport: GithubImport;
 let mockedGenerateReport: GenerateReport;
 let mockedVuePressGenerator: VuePressGenerator;


  beforeEach(() => {
    container = new Container();
    container.bind(Analysis).toSelf().inSingletonScope();
    
    mockedComputeStatistics = mock(ComputeStatistics);
    const computeStatistics = instance(mockedComputeStatistics);
    container.bind(ComputeStatistics).toConstantValue(computeStatistics);

    mockedGithubImport = mock(GithubImport);
    const githubImport = instance(mockedGithubImport);
    container.bind(GithubImport).toConstantValue(githubImport);

    mockedGenerateReport = mock(GenerateReport);
    const generateReport = instance(mockedGenerateReport);
    container.bind(GenerateReport).toConstantValue(generateReport);


    mockedVuePressGenerator = mock(VuePressGenerator);
    const vuePressGenerator = instance(mockedVuePressGenerator);
    container.bind(VuePressGenerator).toConstantValue(vuePressGenerator);


  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('test analysis', async () => {

    const analysis = container.get(Analysis);
    const startDate = new Date();
    await analysis.analyze(startDate);
    verify(mockedComputeStatistics.compute(anything(), anything())).once();


    const githubImportFirstCall = capture(mockedGithubImport.import).first();
    expect(githubImportFirstCall[0]).toEqual(startDate);

    const computeStatisticsFirstCall = capture(mockedComputeStatistics.compute).first();
    expect(computeStatisticsFirstCall[0]).toEqual(startDate);

  });

});
