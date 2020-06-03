import * as fs from 'fs-extra';
import * as moment from 'moment';
import * as path from 'path';

import { Report } from '../api/report';
import { injectable } from 'inversify';

@injectable()
export class VuePressGenerator {
  protected async copyImages(vuePressHiddenFolder: string): Promise<void> {
    const imageSrc = path.resolve(__dirname, 'eclipseche.svg');
    const imageDir = path.resolve(vuePressHiddenFolder, 'public', 'images');
    const imageDest = path.resolve(imageDir, 'eclipseche.svg');
    await fs.ensureDir(imageDir);
    await fs.copy(imageSrc, imageDest);
  }

  protected async generateStyle(vuePressHiddenFolder: string): Promise<void> {
    const vuepressStylesDir = path.resolve(vuePressHiddenFolder, 'styles');
    await fs.ensureDir(vuepressStylesDir);

    // https://vuepress.vuejs.org/config/#palette-styl
    const contentPalette = `
      $accentColor = #FDB940
      $textColor = #eeeeee

      $borderColor = #292E4B

      $sidebarWidth = 10rem
      $contentWidth = 900px
      
      `;

    const vuepressPaletteFile = path.resolve(vuepressStylesDir, 'palette.styl');
    await fs.writeFile(vuepressPaletteFile, contentPalette, { encoding: 'utf8' });

    const contentIndex = `
    html, body, .navbar, .sidebar, .links, .search-box input, .search-box .suggestions {
      background-color: #292C2F !important;
    }

    .search-box .suggestion.focused {
      background-color: #333 !important;
    }

    .home .footer {
      font-size: x-small;
    }
    
    .home .hero img {
      height: 200px;
    }

    `;
    const vuepressIndexFile = path.resolve(vuepressStylesDir, 'index.styl');
    await fs.writeFile(vuepressIndexFile, contentIndex, { encoding: 'utf8' });
  }

  protected async generateReadme(vuepressRootDir: string, reports: Report[]): Promise<void> {
    const updated = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss [UTC]');
    const content = `---
home: true
heroImage: images/eclipseche.svg
actionText: View Stats →
actionLink: /2020/
footer: Copyright © 2020 Florent Benoit / updated ${updated}
---`;
    const vuepressReadmeFile = path.resolve(vuepressRootDir, 'README.md');
    await fs.writeFile(vuepressReadmeFile, content, { encoding: 'utf8' });

    // for each year
    const emptyContent = '';
    const uniqueYears = reports
      .map((report) => report.weekYear)
      .filter((year, index, array) => array.indexOf(year) == index);

    for await (const year of uniqueYears) {
      await fs.writeFile(path.resolve(vuepressRootDir, `${year}`, 'README.md'), emptyContent, { encoding: 'utf8' });
    }
  }

  protected async generateConfigFile(vuepressConfigFile: string, reports: Report[]): Promise<void> {
    const vuepressConfig = {
      title: 'Eclipse Che',
      description: 'from the Trenches',
      /*theme: 'antdocs',*/
      base: '/che-trend/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Stats', link: '/2020/' },
          { text: 'Eclipse Che website', link: 'https://www.eclipse.org/che' },
        ],
        sidebar: [],
      },
    };

    // for each year, get a list of reverse ordered children
    const reportsPerYear = new Map<number, string[]>();
    reports.forEach((report) => {
      const year = parseInt(report.weekYear);
      const children = reportsPerYear.get(year);
      const fileLink = `${report.weekYear}/${report.name}`;
      if (!children) {
        reportsPerYear.set(year, [fileLink]);
      } else {
        children.push(fileLink);
      }
    });

    reportsPerYear.forEach((values, key) => {
      const item = { title: key, children: values.sort().reverse() };
      (vuepressConfig.themeConfig.sidebar as Array<unknown>).push(item);
    });

    const content = `
    module.exports = ${JSON.stringify(vuepressConfig, null, 2)}
    `;

    await fs.writeFile(vuepressConfigFile, content, { encoding: 'utf8' });
  }

  public async generate(reports: Report[]): Promise<void> {
    const vuepressRootDir = path.resolve(__dirname, '..', '..', 'vuepress-output');
    if (await fs.pathExists(vuepressRootDir)) {
      await fs.remove(vuepressRootDir);
    }
    await fs.ensureDir(vuepressRootDir);

    for await (const report of reports) {
      // year folder
      const yearFolder = path.resolve(vuepressRootDir, report.weekYear);
      await fs.ensureDir(yearFolder);
      const file = path.resolve(yearFolder, `${report.name}.md`);
      await fs.writeFile(file, report.content, { encoding: 'utf8' });
    }

    const vuePressHiddenFolder = path.resolve(vuepressRootDir, '.vuepress');
    await fs.ensureDir(vuePressHiddenFolder);
    const vuepressConfigFile = path.resolve(vuePressHiddenFolder, 'config.js');
    this.generateConfigFile(vuepressConfigFile, reports);

    // generate READMEs
    await this.generateReadme(vuepressRootDir, reports);

    // generate style
    await this.generateStyle(vuePressHiddenFolder);

    // Generate images
    await this.copyImages(vuePressHiddenFolder);
  }
}
