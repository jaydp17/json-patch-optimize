## JSON Patch optimize

JSON Patch optimize is a sample implementation of what it'd look like to have a function that takes JSON Patches & reduces it to its smallest form.

A few examples:

```js
// input
[
  { op: 'add', path: '/foo', value: 'bar' },
  { op: 'add', path: '/bar', value: 'baz' },
  { op: 'remove', path: '/foo' }
];

// output
[{ op: 'add', path: '/bar', value: 'baz' }];
```

```js
// input
[
  { op: 'add', path: '/a', value: 42 },
  { op: 'replace', path: '/a', value: 43 },
  { op: 'copy', from: '/a', path: '/b' },
  { op: 'remove', path: '/a' }
];

// output
[{ op: 'add', path: '/b', value: 43 }];
```

## ⚠ Known issues

Array operations could be improved, as the current implementation is built in a way where all array operations get merged into a new array replace command.

For example:

```js
// starting state
{
  foo: ['bar', 'baz'];
}

// input patches
[
  { op: 'add', path: '/foo/-', value: 'qux' },
  { op: 'add', path: '/foo/-', value: 'qux2' },
  { op: 'copy', from: '/foo/1', path: '/newKey' }
];

// current output
[
  { op: 'replace', path: '/foo', value: ['bar', 'baz', 'qux', 'qux2'] },
  { op: 'add', path: '/newKey', value: 'baz' }
];

// expected output
[
  { op: 'add', path: '/foo/-', value: 'qux' },
  { op: 'add', path: '/foo/-', value: 'qux2' },
  { op: 'copy', from: '/foo/1', path: '/newKey' }
];
```

The output is correct in most scenarios, but by overwriting all the elements in the array we might sometimes lose data if the state on the server & client is out of sync.

## 🧪 Tests

Tests are available at [src/optimize.test.js](./src/optimize.test.js).

You can run them using

```bash
npm test
```

I've also added a test case where we can see the [known-issues](#-known-issues) in action.
To do that, go to [src/optimize.test.js#L49](./src/optimize.test.js#L49), un-comment the last test case & re-run tests.
