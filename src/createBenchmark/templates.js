'use strict';
const { camelCase } = require('lodash');
const makeRequire = (dep) => `const ${camelCase(dep)} = require ('${dep}');\n`;

const makeMain = ({ body, dependencies = [] }) => `'use strict';
${dependencies.map(makeRequire).join('')}
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