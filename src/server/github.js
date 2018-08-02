'use strict';
const octokit = require('@octokit/rest')();
const { find, pipe, get, deburr, kebabCase } = require('lodash/fp');
const { REPO: repo, BENCHMARKS_PATH: path, GITHUB_TOKEN, REPO_OWNER: owner } = require('./env');

// token (https://github.com/settings/tokens)
octokit.authenticate({
    type: 'token',
    token: GITHUB_TOKEN
});

const encodeContent = (str) => new Buffer(str).toString('base64');
// Inject the timestamp between name and ext. If extension is not provided is generated
const makePath = (path, filename) => `${path}/${filename.replace(/(\.js)?$/, `-${Date.now()}.js`)}`;

const createBranch = branchName => sha => octokit.gitdata.createReference({
    owner,
    repo,
    sha,
    ref: `refs/heads/${branchName}`
});


const getSha = get('object.sha');
const findMaster = pipe(get('data'), find({ ref: 'refs/heads/master' }), getSha);

const getMasterSha = () => octokit.gitdata
    .getReferences({ owner, repo, per_page: 100 })
    .then(findMaster);

const ensureBranch = (branchName) => octokit.gitdata
    .getReference({ owner, repo, ref: `heads/${branchName}` })
    .catch(() => getMasterSha().then(createBranch(branchName)));

const normalizeStr = pipe(deburr, kebabCase);

const createFile = async ({
    content,
    author = { name: 'anonimous', email: 'nobody@example.com' },
    message = 'Just another benchmark for our growing collection',
    name = ''
} = {}) => {

    name = normalizeStr(name);
    const d = new Date();
    const branch = d.toISOString().replace(/-/g, '').split('T')[0];
    const branchStatus = await ensureBranch(branch);
    console.log('Branch created ?', branchStatus);
    return octokit.repos.createFile({
        repo, owner,
        path: makePath(path, name),
        content: encodeContent(content),
        message, branch, author
    });
};

module.exports = { createFile, makePath, encodeContent };