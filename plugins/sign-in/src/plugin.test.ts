import { signInPlugin } from './plugin';

describe('sign-in', () => {
  it('should export plugin', () => {
    expect(signInPlugin).toBeDefined();
  });
});
