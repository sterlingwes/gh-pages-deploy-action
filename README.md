# Github Pages Deploy

GitHub Action to build and deploy a Github Pages site using the build command & output folder you specify.

## Usage

This GitHub Action will run the build command you specify at the root of your repository and
deploy it to GitHub Pages for you! Here's a basic workflow example:

```yml
# .github/workflows/main.yml

name: Github Pages Publish

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: sterlingwes/gh-pages-deploy-action
        with:
          access-token: ${{ secrets.ACCESS_TOKEN }}
          source-directory: public
          build-command: yarn build
```
