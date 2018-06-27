'use strict';

const makeSet = (bigSet) => {

    const mediumLength = bigSet.length / 2;
    const smallLength = mediumLength / 10;
    const ssLength = smallLength / 10;

    let medium, small, xSmall;
    return {
        bigSet,
        get mediumSet() {
            medium = medium || bigSet.slice(0, mediumLength);
            return medium;
        },
        get smallSet() {
            small = small || bigSet.slice(0, smallLength);
            return small;
        },
        get xSmallSet() {
            xSmall = xSmall || bigSet.slice(0, ssLength);
            return xSmall;
        }
    };
};


module.exports = {
    users: _ => makeSet(require('./users'))
};