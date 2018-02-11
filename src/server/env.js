'use strict';

const {
    REPO = 'nodejs-benchmarks',
    REPO_OWNER = 'danielo515',
    BENCHMARKS_PATH = 'src/benchmarks',
    GITHUB_TOKEN
    } = process.env;

module.exports = { REPO, GITHUB_TOKEN, BENCHMARKS_PATH, REPO_OWNER };