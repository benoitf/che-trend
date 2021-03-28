import * as fs from 'fs-extra';
import * as handlerbars from 'handlebars';
import * as path from 'path';

import { injectable } from 'inversify';

@injectable()
export class TemplateGenerator {
  public async renderWeekReport(env?: unknown): Promise<string> {
    return this.render('week-report-template.md', env);
  }

  public async renderRoadmap(env?: unknown): Promise<string> {
    return this.render('roadmap-template.md', env);
  }

  public async render(file: string, env?: unknown): Promise<string> {
    const content = await fs.readFile(path.join(__dirname, file), 'utf8');
    const template: HandlebarsTemplateDelegate = handlerbars.compile(content);
    return template(env);
  }
}
