import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { env } from '../types/environments';

export async function generatePgContainer(): Promise<StartedTestContainer> {
  const container = await new GenericContainer('postgres')
    .withEnvironment(env)
    .withExposedPorts(5432)
    .withName('devportal')
    .start();

  return container;
}
