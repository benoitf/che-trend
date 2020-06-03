import 'reflect-metadata';

import { Main } from './main';

(async (): Promise<void> => {
  await new Main().start();
})();
