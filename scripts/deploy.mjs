import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

/**
 * Ships the built app to the live site: build -> sync dist/ to the site bucket ->
 * invalidate CloudFront so the new index.html is served immediately. Which env it
 * targets comes from DEPLOY_STACK in .env.production; the bucket, distribution and
 * site URL are read from that stack's CloudFormation outputs, so the script itself
 * carries no per-env values.
 */
if (!existsSync('.env.production')) {
  throw new Error('.env.production is missing');
}

const env = Object.fromEntries(
  readFileSync('.env.production', 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => [
      line.slice(0, line.indexOf('=')).trim(),
      line.slice(line.indexOf('=') + 1).trim(),
    ]),
);

const stack = env.DEPLOY_STACK;
if (!stack) {
  throw new Error('DEPLOY_STACK is missing');
}

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function stackOutput(key) {
  const value = execSync(
    `aws cloudformation describe-stacks --stack-name ${stack} --query "Stacks[0].Outputs[?OutputKey=='${key}'].OutputValue" --output text`,
    { encoding: 'utf8' },
  ).trim();
  if (!value || value === 'None') {
    throw new Error(`Stack ${stack} has no output ${key} — is the hosting stack deployed?`);
  }
  return value;
}

const bucket = stackOutput('SiteBucketName');
const distributionId = stackOutput('DistributionId');

run('npm run build');
// --delete clears assets from previous builds (Vite hashes filenames, so old
// bundles are dead weight the moment a new index.html stops referencing them).
run(`aws s3 sync dist s3://${bucket} --delete`);
run(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`);

console.log(`\nLive: ${stackOutput('SiteUrl')}`);
