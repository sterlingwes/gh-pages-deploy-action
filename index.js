const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');
const ioUtil = require('@actions/io/lib/io-util');

async function run() {
  try {
    const accessToken = core.getInput('access-token');
    if (!accessToken) {
      core.setFailed(
        'No personal access token found. Please provide one by setting the `access-token` input for this action.',
      );
      return;
    }

    const sourceDirectory = core.getInput('source-directory');
    if (!sourceDirectory) {
      core.setFailed(
        'No deploy directory specified. Please provide one by setting the `source-directory` input for this action.',
      );
      return;
    }

    const deployBranch = core.getInput('deploy-branch');
    if (!deployBranch) deployBranch = 'gh-pages';

    if (github.context.ref === `refs/heads/${deployBranch}`) {
      console.log(`Triggered by branch used to deploy: ${github.context.ref}.`);
      console.log('Nothing to deploy.');
      return;
    }

    const autoInstallInput = core.getInput('auto-install');
    const autoInstall = autoInstallInput === 'true' || autoInstallInput === 'yes';
    if (autoInstall) {
      const pkgManager = (await ioUtil.exists('./yarn.lock')) ? 'yarn' : 'npm';
      console.log(`Installing your site's dependencies using ${pkgManager}.`);
      await exec.exec(`${pkgManager} install`);
      console.log('Finished installing dependencies.');
    } else {
      console.log('Skipping dependency installation (auto-install is disabled).');
    }

    const buildCommand = core.getInput('build-command');
    if (!buildCommand) {
      core.setFailed(
        'No build command specified. Please provide one by setting the `build-command` input for this action.',
      );
      return;
    }

    console.log(`Building your site with command: ${buildCommand}`);
    await exec.exec(buildCommand);
    console.log('Finished building your site.');

    const customDomain = core.getInput('custom-domain');
    if (customDomain) {
      exec.exec(`echo "${customDomain}" >> "./${sourceDirectory}/CNAME"`);
      console.log('Wrote CNAME to deploy directory for custom domain.');
    }

    const repo = `${github.context.repo.owner}/${github.context.repo.repo}`;
    const repoURL = `https://${accessToken}@github.com/${repo}.git`;
    console.log(`Deploying to repo: ${repo} and branch: ${deployBranch}`);

    const cwd = `./${sourceDirectory}`;
    await exec.exec(`git init`, [], { cwd });
    await exec.exec(`git config user.name`, [github.context.actor], { cwd });
    await exec.exec(`git config user.email`, [`${github.context.actor}@users.noreply.github.com`], {
      cwd,
    });
    await exec.exec(`git add`, ['.'], { cwd });
    await exec.exec(
      `git commit`,
      ['-m', `deployed via Github Pages Deploy Action 🚀 for ${github.context.sha}`],
      { cwd },
    );
    await exec.exec(`git push`, ['-f', repoURL, `HEAD:${deployBranch}`], { cwd });
    console.log('Finished deploying your site.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
