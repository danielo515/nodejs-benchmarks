# NodeJs benchmark framework

[![Greenkeeper badge](https://badges.greenkeeper.io/danielo515/nodejs-benchmarks.svg)](https://greenkeeper.io/)

This repository is a collection of tools, conventions and libraries aimed at
making easy the benchmarking of JavaScript code under NodeJs.

We use internally `benchr`, which in turn uses the highly popular Benchmakr.js library for meaningful benchmarking.

This repository includes some of the most common and performant javascript libraries out of the box.
If you want to explore the available benchmarks just explore the `src/benchmarks` folder.

## Running benchmarks

We provide several scripts that improves the experience of the user interacting with this repository.
You can run any of them by just doing `npm run scriptname` where `scriptname` is one of the list below:

* `start-all`: Executes all the benchmarks contained on the benchmarks directory
* `start`: Brings a wizard that allows you to select a group of benchmarks to run

## Creating benchmarks

If you want to contribute with benchmarks the only thing you have to do is add a JavaScript file under `src/benchmarks`.
This file must export a single function taking two parameters `suite` and `benchmark`. You have to use those parameters to register your own benchmarks. Here is the simplest example:

```js
module.exports = (suite, benchmark) => {

    suite(`Sum numbers`, () => {

        benchmark('Decimal', () => {

            1+2
        });
        benchmark('Binary', () => {

            0b10 + 0b01
        });
    });
});
```
