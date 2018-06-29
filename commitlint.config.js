'use strict';
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [2, 'always', ['utils', 'benchmarks', 'profiling', 'tools', 'deps', 'data', 'instructions', 'charting', 'ci', 'ui']]
    }
};
