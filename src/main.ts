import { Analysis } from './analysis';
import { InversifyBinding } from './inversify-binding';

export class Main {
  protected async doStart(): Promise<void> {
    const githubReadToken: string = process.env.GITHUB_TOKEN || '';
    if ('' === githubReadToken) {
      throw new Error('Unable to start as GITHUB_TOKEN is missing');
    }

    const token = `token ${githubReadToken}`;

    const inversifyBinbding = new InversifyBinding(token);
    const container = inversifyBinbding.initBindings();
    const analysis = container.get(Analysis);

    // start date
    const startDate = new Date('2020-05-01T00:00:00Z');
    await analysis.analyze(startDate);
  }

  async start(): Promise<boolean> {
    try {
      await this.doStart();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
