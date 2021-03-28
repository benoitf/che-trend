# che-trend

Generate trends from github data

Result is published there: https://benoitf.github.io/che-trend/

## To run locally

Set `GITHUB_TOKEN`

```bash
export GITHUB_TOKEN=<your gh token>
```

Build and generate markdown files

``` bash
yarn
yarn run compile
node lib/entrypoint.js
# md files are generated in folder vuepress-outpu
```

Locally run vuepress

```bash
(cd vuepress-output && ../node_modules/.bin/vuepress dev)
```

Other commands

```bash
yarn format
yarn lint
yarn test
```
