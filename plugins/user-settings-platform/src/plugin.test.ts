import { userSettingsPlugin } from './plugin';

describe('user-settings', () => {
  it('should export plugin', () => {
    expect(userSettingsPlugin).toBeDefined();
  });
});