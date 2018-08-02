'use strict';
const { singleton, ap, flip, map, prop, compose, insert, foldMap, pipe } = require ('sanctuary');
const { users: Users } = require('../fake-data');
const users = [{name:'joe', age: 12 },{name:'peter', age:15}];
const B = compose;
const indexBy = function (key) {
    return flip(B(pipe)(map(ap(flip(insert))(prop(key)))))({});
};
function ixBy(key) {
    return foldMap (Object) (ap (flip (singleton)) (prop(key)));
}

const smallList = Users().smallSet;

module.exports = (suite, benchmark) => {
    
    suite(`Decide indexby implementation (2 users)`, () => {

        benchmark(`Current implementation (pipe, map, ap and insert)`, () => {

            indexBy ('name') (users);
        });
        benchmark(`New implementation ( foldMap, ap and singleton)`, () => {

            ixBy ('name') (users);
        });

    });
    suite(`Decide indexby implementation (${smallList.length})`, () => {

        benchmark(`Current implementation (pipe, map, ap and insert)`, () => {

            indexBy ('name') (smallList);
        });
        benchmark(`New implementation ( foldMap, ap and singleton)`, () => {

            ixBy ('name') (smallList);
        });

    });

};