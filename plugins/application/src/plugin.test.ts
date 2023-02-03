import { applicationPlugin } from './plugin';

describe('application', () => {
  it('should export plugin', () => {
    expect(applicationPlugin).toBeDefined();
  });
});
