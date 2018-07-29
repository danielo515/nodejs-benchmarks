'use strict';
const { omit, sample, pick } = require('lodash');
const { omit: omitFp, pick: pickFp, has, negate } = require('lodash/fp');
const { users } = require('../fake-data');
const C = require('crocks');
const R = require('ramda');
const S = require('sanctuary').unchecked;
const Ot = require('object-translate');
const L = require('partial.lenses');

const sets = users();
const samplify = desc => x => console.log(desc, sample(x))

const makeBenchmark = benchmark => contenders => assertions => set =>
{   
    const fail = desc => val => _ => { console.log('== SAMPLE ==', val); throw new Error(`${desc} does not satisfy all the predicates: `) }
    contenders.forEach (([desc, fn]) => 
        S.unless (S.allPass (assertions)) (fail (desc) (fn(set[0]))) (fn(set[0]))
    )
    
    return _ => contenders.forEach ( ([description, fn]) => benchmark(description, () => set.map(fn)) )
}


const shouldNotHave = props => props.map (p => negate(has(p)))
const shouldInclude = props => S.map (has) (props)


/* Example
{ "name": "Octavia"
, "phone": "202-746-5929 x495"
, "profile": { "email": "Lucas.Ritchie46@hotmail.com", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/justinrhee/128.jpg" }
, "meta": { "column": "token", "type": "varchar" }, "bio": { "birthday": { "year": 1983, "day": 7 } } 
} */

module.exports = (suite, benchmark) => {

    const makeBench = makeBenchmark (benchmark);

    const omitName = makeBench (

        [
            ['lodash/FP', omitFp('name')],
            ['Ramda omit', R.omit(['name'])],
            ['Ramda dissoc', R.dissoc('name')],
            ['Partial lenses', L.remove('name')],
            ['Croks', C.omit(['name'])],
            ['Inlined lodash', (usr) => omit(usr, 'name')]
        ])
        ([ negate (has ('name'))]);

    const omitNested = makeBench (

        [
            ['lodash/FP', omitFp('bio.birthday.year')],
            ['Ramda dissocPath', R.dissocPath(['bio','birthday','year'])],
            ['Partial lenses', L.remove(['bio','birthday','year'])],
            ['Inlined lodash', (usr) => omit(usr, 'bio.birthday.year')]
        ])
        ([ negate (has ('bio.birthday.year')), has ('name'), has ('phone')]);

    const pickProps = makeBench (

        [
            ['lodash/FP', pickFp(['name', 'phone','bio'])],
            ['Inlined lodash', (usr) => pick(usr, ['name', 'phone','bio'])],
            ['Sanctuary ap', S.ap({'name':S.I, 'phone':S.I,'bio':S.I})],
            ['Object translate', Ot({'name':'name', 'phone':'phone','bio':'bio'})],
            ['Partial lenses', L.get(L.props('name', 'phone','bio'))],
            ['Ramda', R.pick(['name', 'phone','bio'])],
            ['Croks', C.pick(['name', 'phone','bio'])],
        ])
        ([ negate (has ('meta')), has ('name'), has ('phone'), has ('bio')]);

    const pickNestedProps = makeBench (

        [
            ['lodash/FP', pickFp(['name','profile.email', 'bio.birthday.year'])],
            ['Inlined lodash', (usr) => pick(usr, ['name','profile.email', 'bio.birthday.year'])],
            ['Sanctuary ap', S.ap({'name':S.I, profile: S.ap({ email: S.I }), bio: S.ap({birthday: S.ap({year: S.I})})})],
            ['Object translate', Ot({'name':'name', profile: { email: 'profile.email'}, 'bio':{birthday: {year: 'bio.birthday.year'}}})],
            ['Partial lenses', L.get(L.pickIn({name: [], profile: {email: []}, bio: {birthday: {year: []}}}))],
        ])
        ([ 
            ...shouldNotHave (['profile.avatar','meta','bio.birthday.day']), 
            ...shouldInclude(['profile.email','name','bio.birthday.year'])
        ]);
    
    const pickNestedToFlat = makeBench (

        [
            ['Sanctuary ap', S.ap({'name':S.I, profile: S.prop('email'), bio: S.props(['birthday','year'])})],
            ['Object translate', Ot({'name':'name', profile: 'profile.email', 'bio':'bio.birthday.year'})],
            ['Partial lenses', L.get(L.pick({name: 'name', profile: ['profile','email'], bio:['bio','birthday','year']}))],
        ])
        ([ 
            ...shouldNotHave (['profile.avatar','meta','bio.birthday.day']), 
            ...shouldInclude(['profile','name','bio'])
        ]);

    suite(`Omit name (${sets.bigSet.length} users)`, omitName(sets.bigSet));
    suite(`Omit name (${sets.smallSet.length} users)`, omitName(sets.smallSet));
    suite(`Omit nested year prop (${sets.bigSet.length} users)`, omitNested(sets.bigSet));
    suite(`Omit nested year prop (${sets.smallSet.length} users)`, omitNested(sets.smallSet));
    suite(`Pick 3 root props (${sets.bigSet.length} users)`, pickProps(sets.bigSet));
    suite(`Pick 3 root props (${sets.smallSet.length} users)`, pickProps(sets.smallSet));
    suite(`Pick nested props same structure (${sets.bigSet.length} users)`, pickNestedProps(sets.bigSet));
    suite(`Pick nested props same structure (${sets.smallSet.length} users)`, pickNestedProps(sets.smallSet));
    suite(`Pick nested props to flat object (${sets.bigSet.length} users)`, pickNestedToFlat(sets.bigSet));
    suite(`Pick nested props to flat object (${sets.smallSet.length} users)`, pickNestedToFlat(sets.smallSet));
};