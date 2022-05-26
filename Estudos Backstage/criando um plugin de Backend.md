# Criando um plugin de Back End

## Criando um plug-in de back-end

Um novo pacote de plug-in de back-end básico pode ser criado emitindo o seguinte comando na raiz do repositório do Backstage:

```sh
yarn create-plugin --backend
```

Por favor, veja também o `--help`sinalizador do `create-plugin`comando para algumas opções adicionais que estão disponíveis, notadamente os sinalizadores `--scope`e `--no-private` que controlam a nomenclatura e a publicação do pacote recém-criado. Sua raiz de repositório `package.json`provavelmente também terá alguns valores padrão já configurados para eles.

Você será solicitado a fornecer um nome para o plugin. Este é um identificador que fará parte do nome do pacote NPM, portanto, deixe-o curto e contendo apenas caracteres minúsculos separados por hífens, por exemplo `carmen`, se for um pacote que adiciona uma integração com um sistema chamado Carmen, por exemplo. O nome completo do pacote NPM seria algo como `@internal/plugin-carmen-backend`, dependendo dos outros sinalizadores passados para o `create-plugin`comando e de suas configurações para o `create-plugin`comando em seu arquivo root `package.json`.

A criação do plugin vai demorar um pouco, então seja paciente. Ele executará de maneira útil a instalação inicial e os comandos de compilação, para que seu pacote esteja pronto para ser hackeado! Ele estará localizado em uma nova pasta em seu `plugins`diretório, neste exemplo `plugins/carmen-backend`.

Para fins de desenvolvimento simples, um plug-in de back-end pode ser iniciado em um modo autônomo. Você pode fazer um teste de primeira luz do seu serviço:

```sh
cd plugins/carmen-backend
yarn start
```

Isso vai pensar um pouco e depois dizer `Listening on :7007`. Em uma janela de terminal diferente, agora execute

```sh
curl localhost:7007/carmen/health
```

Isso deve retornar `{"status":"ok"}`. Sucesso! Pressione `Ctrl + c`para matá-lo novamente.

## Desenvolvendo seu plug-in de back-end

Um plug-in de back-end recém-criado não faz basicamente nada, em termos do aplicativo geral. Ele tem um pequeno conjunto de dependências básicas e expõe um roteador Express em `src/service/router.ts`. É aqui que você começará a adicionar rotas e conectá-las à funcionalidade subjacente real. Mas nada em seu aplicativo/backend Backstage o expõe.

Para realmente conectar e executar o roteador do plug-in, você fará algumas modificações no seu back-end.

```bash
# From the Backstage root directory
yarn add --cwd packages/backend @internal/plugin-carmen-backend@^0.1.1 # Change this to match the plugin's package.json
```

Crie um novo arquivo chamado `packages/backend/src/plugins/carmen.ts`e adicione o seguinte a ele

```ts
import { createRouter } from '@internal/plugin-carmen-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger: env.logger,
  });
}
```

E, finalmente, conecte-o ao roteador de back-end geral. Editar `packages/backend/src/index.ts`:

```ts
import carmen from './plugins/carmen';
// ...
async function main() {
  // ...
  const carmenEnv = useHotMemoize(module, () => createEnv('carmen'));
  apiRouter.use('/carmen', await carmen(carmenEnv));
```

Depois de iniciar o backend (por exemplo, usando `yarn start-backend`a partir da raiz do repositório), você poderá buscar dados dele.

```sh
# Note the extra /api here
curl localhost:7007/api/carmen/health
```

Isso deve retornar `{"status":"ok"}`como antes. Sucesso!

## Fazendo uso de um banco de dados

O backend Backstage vem com um recurso integrado para acesso ao banco de dados SQL. A maioria dos plugins que têm necessidades de persistência optarão por fazer uso desse recurso, para que os operadores do Backstage possam gerenciar as necessidades do banco de dados de maneira uniforme.

Como parte do objeto de ambiente que é passado para sua `createPlugin` função, existe um `database`campo. Você pode usar isso para obter um objeto de conexão [Knex .](http://knexjs.org/)

```ts
// in packages/backend/src/plugins/carmen.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const db: Knex<any, unknown[]> = await env.database.getClient();

  // You will then pass this client into your actual plugin implementation
  // code, maybe similar to the following:
  const model = new CarmenDatabaseModel(db);
  return await createRouter({
    model: model,
    logger: env.logger,
  });
}
```

Você pode notar que a `getClient`chamada não tem parâmetros. Isso ocorre porque todas as necessidades do banco de dados do plug-in são configuradas na `backend.database`chave de configuração do seu arquivo `app-config.yaml`. A estrutura pode até garantir nos bastidores que o banco de dados lógico é criado automaticamente se não existir, com base em regras que o operador Backstage decide.

No entanto, a estrutura não lida com migrações de esquema de banco de dados para você. Os plugins integrados no repositório principal optaram por usar a biblioteca Knex para gerenciar migrações de esquema também, mas você pode fazer isso da maneira que achar melhor.

Consulte a [documentação da biblioteca Knex](http://knexjs.org/) para obter exemplos e detalhes sobre como escrever migrações de esquema e executar consultas SQL em seu banco de dados.