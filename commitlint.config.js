module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [2, 'always', ['utils','benchmarks','tools','deps']]
    }
};
