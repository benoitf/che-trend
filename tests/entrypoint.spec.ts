import 'reflect-metadata';

describe('Test Entrypoint', () => {
  const originalConsoleError = console.error;
  const mockedConsoleError = jest.fn();

  beforeEach(() => (console.error = mockedConsoleError))
  afterEach(() => (console.error = originalConsoleError))

  
  test('test entrypoint', async () => {
    await require('../src/entrypoint');
    expect(mockedConsoleError).toBeCalled();
  });
});
