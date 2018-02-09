'use strict';
const { camelCase } = require('lodash');
const makeRequire = ({ varName, require }) => `const ${varName} = require ('${require}');\n`;
const formatDeps = (dep) => typeof dep === 'string'
    ? { varName: camelCase(dep), require: dep }
    : {
        require: dep.name,
        varName: (dep.destructuring || []).length ? `{ ${dep.destructuring.join(', ')} }` : dep.alias || camelCase(dep.name)
    };

const makeMain = ({ body, preTest = '', dependencies = [] }) => `'use strict';
${dependencies.map(formatDeps).map(makeRequire).join('')}
${preTest}
module.exports = (suite, benchmark) => {
    ${body}
};`;

const makeSuite = ({ title, body }) => `
suite(\`${title}\`, () => {

    ${body}
});
`;

const makeBenchmark = ({ title, body }) => `benchmark(\`${title}\`, () => {

    ${body}
});
`;


module.exports = { makeMain, makeSuite, makeBenchmark };