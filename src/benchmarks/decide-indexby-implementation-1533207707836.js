'use strict';
const { singleton, ap, flip, map, prop, compose, insert, foldMap } = require ('sanctuary');

const users = [{name:'joe', age: 12 },{name:'peter', age:15}];
const B = compose;
const indexBy = function (key) {
    return flip(B(pipe)(map(ap(flip(insert))(prop(key)))))({});
};
function ixBy(f) {
    return foldMap (Object) (ap (flip (singleton)) (f));
}

module.exports = (suite, benchmark) => {
    
    suite(`undefined`, () => {

        benchmark(`Current implementation (pipe, map, ap and insert)`, () => {

            indexBy ('name') (users);
        });
        benchmark(`New implementation ( foldMap, ap and singleton)`, () => {

            ixBy (prop ('name')) (users);
        });

    });

};