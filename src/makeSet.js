'use strict';

const defaultMaker = ()=> Math.random() * 1000;

module.exports = (maker = defaultMaker , setSize = 1e5)=> { 
    
    const bigSet = [];
    
    while (setSize){
        bigSet.push( maker() );
        setSize--;
    }

    const mediumLength = bigSet.length / 2;
    const smallLength = mediumLength / 10;
    const ssLength = smallLength / 10;

    let medium,small,xSmall;
    return {
        bigSet,
        get mediumSet(){
            medium = medium || bigSet.slice(0,mediumLength);
            return medium;
        },
        get smallSet(){
            small = small || bigSet.slice(0,smallLength);            
            return small;
        },
        get xSmallSet(){
            xSmall = xSmall || bigSet.slice(0,ssLength);
            return xSmall;
        }
    };
};