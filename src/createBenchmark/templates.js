'use strict';

const makeMain = ({ body }) => `'use strict';
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