/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { Main } from '../src/main';

jest.mock('../src/analysis');

describe('Test Main with stubs', () => {
  const originalProcessEnv = process.env;
  const mockedProcessEnv: any = {};

  beforeEach(() => (process.env = mockedProcessEnv));
  afterEach(() => (process.env = originalProcessEnv));

  test('test with token', async () => {
    mockedProcessEnv.GITHUB_TOKEN = 'foo';
    const main = new Main();
    const returnCode = await main.start();
    expect(returnCode).toBeTruthy();
  });
});
