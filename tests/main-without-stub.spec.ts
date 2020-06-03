/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { Main } from '../src/main';


describe('Test Main without stubs', () => {

  const originalConsoleError = console.error;
  const mockedConsoleError = jest.fn();

  beforeEach(() => (console.error = mockedConsoleError))
  afterEach(() => (console.error = originalConsoleError))

  test('test missing token', async () => {
    const main = new Main();
    const returnCode = await main.start();
    expect(mockedConsoleError).toBeCalled();
    expect(returnCode).toBeFalsy();
  });

});