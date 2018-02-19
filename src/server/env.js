'use strict';

const {
    REPO = 'nodejs-benchmarks',
    REPO_OWNER = 'danielo515',
    BENCHMARKS_PATH = 'src/benchmarks',
    GITHUB_TOKEN
} = process.env;

const PORT = parseInt(process.env.PORT) || 30000;

module.exports = { REPO, GITHUB_TOKEN, BENCHMARKS_PATH, REPO_OWNER, PORT };