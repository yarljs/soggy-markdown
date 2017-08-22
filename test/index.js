const test = `
# Hello World
My name is {{foo.bar.baz}}

Today is {{foo.bing}}

`;

const failTest = `
# Hello World
My name is foo.bar.baz

Today is {{foo.bing

`;


const sm = require('../index.js');

console.log(sm.parse(test, {
  foo: {
    bar: {
      baz: 'Clark Rinker'
    },
    bing: 'Ayy'
  }
}));

// console.log(sm.parse(failTest, {
//   foo: {
//     bar: {
//       baz: 'Clark Rinker'
//     },
//     bing: 'Ayy'
//   }
// }));
