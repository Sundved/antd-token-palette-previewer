import { capitalize } from '../utils/capitalize';

describe('test', () => {
  it('test it', () => {
    const string = capitalize('foo');
    expect(string).toBe('Foo');
  });
});
