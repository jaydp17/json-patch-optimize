const optimize = require('./optimize');

const cases = [
  {
    name: 'email example',
    patches: [
      { op: 'add', path: '/foo', value: 'bar' },
      { op: 'add', path: '/bar', value: 'baz' },
      { op: 'remove', path: '/foo' }
    ],
    expected: [{ op: 'add', path: '/bar', value: 'baz' }]
  },
  {
    name: 'merge nested value assign',
    patches: [
      { op: 'add', path: '/a', value: { b: {} } },
      { op: 'add', path: '/a/b/c', value: ['foo', 'bar'] },
      { op: 'remove', path: '/a/b/c' },
      { op: 'add', path: '/a/b/c', value: 42 }
    ],
    expected: [{ op: 'add', path: '/a', value: { b: { c: 42 } } }]
  },
  {
    name: 'come back to original object',
    patches: [{ op: 'add', path: '/a', value: 'hello' }, { op: 'remove', path: '/a' }],
    expected: []
  },
  {
    name: 'directly use the new value',
    patches: [{ op: 'add', path: '/a', value: 42 }, { op: 'replace', path: '/a', value: 43 }],
    expected: [{ op: 'add', path: '/a', value: 43 }]
  },
  {
    name: 'copy new value',
    patches: [
      { op: 'add', path: '/a', value: 42 },
      { op: 'replace', path: '/a', value: 43 },
      { op: 'copy', from: '/a', path: '/b' },
      { op: 'remove', path: '/a' }
    ],
    expected: [{ op: 'add', path: '/b', value: 43 }]
  },
  {
    name: 'replace an object',
    doc: { foo: { abc: { def: 34 } } },
    patches: [{ op: 'replace', path: '/foo/abc', value: { xyz: 64 } }],
    expected: [{ op: 'replace', path: '/foo/abc', value: { xyz: 64 } }]
  }
  // // Uncomment the below code block
  // ,
  // {
  //   name: 'add element to end',
  //   doc: { foo: ['bar', 'baz'] },
  //   patches: [
  //     { op: 'add', path: '/foo/-', value: 'qux' },
  //     { op: 'add', path: '/foo/-', value: 'qux2' },
  //     { op: 'copy', from: '/foo/1', path: '/newKey' }
  //   ],
  //   expected: [
  //     { op: 'add', path: '/foo/-', value: 'qux' },
  //     { op: 'add', path: '/foo/-', value: 'qux2' },
  //     { op: 'copy', from: '/foo/1', path: '/newKey' }
  //   ]
  // }
];

cases.forEach(({ name, doc = {}, patches, expected }) => {
  test(name, () => {
    const output = optimize(doc, patches);
    expect(output).toEqual(expected);
  });
});
