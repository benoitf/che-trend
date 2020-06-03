import * as fs from 'fs-extra';
import * as handlerbars from 'handlebars';
import * as path from 'path';

import { injectable } from 'inversify';

@injectable()
export class TemplateGenerator {
  public async render(env?: unknown): Promise<string> {
    const content = await fs.readFile(path.join(__dirname, 'template.md'), 'utf8');
    const template: HandlebarsTemplateDelegate = handlerbars.compile(content);
    return template(env);
  }
}
