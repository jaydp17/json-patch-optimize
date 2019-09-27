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
    name: 'add element to end',
    doc: { foo: ['bar', 'baz'] },
    patches: [{ op: 'add', path: '/foo/-', value: 'qux' }],
    expected: [{ op: 'add', path: '/foo/-', value: 'qux' }]
  }
];

cases.forEach(({ name, doc = {}, patches, expected }) => {
  test(name, () => {
    const output = optimize(doc, patches);
    expect(output).toEqual(expected);
  });
});
