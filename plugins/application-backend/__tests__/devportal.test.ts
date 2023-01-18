import { Client } from 'pg';
import { StartedTestContainer } from 'testcontainers';
import { applyMigrations } from './migration/migrate';
import { generatePgContainer } from './setup/containers';
import { devportalClient } from './setup/setups';

jest.setTimeout(20000);
let container: StartedTestContainer;
let client: Client;

beforeAll(async () => {
  container = await generatePgContainer();
  client = await devportalClient(container);
  await applyMigrations(container);
});

test('test', async () => {
  // devportal backend tests
});

afterAll(() => {
  client.end();
  container.stop();
});
