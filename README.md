# Github Pages Custom Deploy

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
      - uses: sterlingwes/gh-pages-deploy-action@v1.3
        with:
          access-token: ${{ secrets.ACCESS_TOKEN }}
          source-directory: public
          build-command: yarn build
```

## Options

| Name               | Description                                                                                                                                                                                                                                                                                                                                                | Required? (default) |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `access-token`     | Required to push chages to your deployment branch. You can get this from your Github Settings > Developer Settings > [Personal Access Tokens](https://github.com/settings/tokens). **Note** that if you use a fine-grained token with content permissions you'll need to prefix the value of your secret with your username, ie: `myname:github_pat_*****` | Yes                 |
| `source-directory` | The name of the subfolder that holds the contents of the site you want deployed. This folder can be generated by your build command, or pre-exist.                                                                                                                                                                                                         | Yes                 |
| `build-command`    | The command you want this Action to run to generate your static site files in the `source-directory` you specify.                                                                                                                                                                                                                                          | Yes                 |
| `deploy-branch`    | The branch Github Pages is setup to source your site's files from. For the yourname.github.io site, this is typically the master branch. For /reponame subfolder deploys, `gh-pages` is the default.                                                                                                                                                       | No (gh-pages)       |
| `custom-domain`    | This is the domain that this Action will write to a `CNAME` file for you on your deploy branch, to enable a custom domain for your Github Pages site.                                                                                                                                                                                                      | No                  |
| `auto-install`     | Whether to automatically install dependencies before running the build command (dependency manager detected based on presence of yarn.lock for yarn vs. npm).                                                                                                                                                                                              | No (Yes)            |

## Related

This is based on a [Gatsby-specific](https://github.com/enriikke/gatsby-gh-pages-action) action written by Enrique Gonzalez 🙏
