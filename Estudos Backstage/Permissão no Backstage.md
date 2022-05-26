# Permissão no Backstage :warning:

- Os plug-ins são responsáveis por definir e expor as permissões que eles impõem.

- Em um nível alto, uma política é uma função que recebe um usuário e permissão do Backstage e retorna uma decisão de permitir ou negar.

- Na estrutura de permissão do Backstage, as políticas são responsáveis pelas decisões e os plug-ins (normalmente back-ends) são responsáveis por aplicá-las.

- A estrutura de permissão apresenta duas abstrações para explicar isso: recursos e regras. Os recursos representam os objetos com os quais os usuários interagem. As regras são controles baseados em predicados que acessam os dados de um recurso. Por exemplo, o plug-in de catálogo define um recurso para entidades de catálogo e uma regra para verificar se uma entidade possui uma determinada anotação.

  

  <a href="https://backstage.io/docs/permission/getting-started" style="background: linear-gradient(#4FAAFF,#2c8ce0); color: white; padding: 10px 40px; border: none; border-radius:10px; font-weight: bold; font-size: 18px; text-decoration: none;">Documentação :bookmark_tabs:</a>

  

Os integradores de bastidores controlam as permissões escrevendo uma política. Em termos gerais, uma política é simplesmente uma **função assíncrona que recebe uma solicitação para autorizar uma ação específica para um usuário e recurso (opcional) e retorna uma decisão sobre autorizar essa permissão**. Os integradores podem implementar suas próprias políticas do zero ou adotar políticas reutilizáveis escritas por outros.



<div><iframe width="560" height="315" src="https://www.youtube.com/embed/EQr9tFClgG0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>



## Pré-requisitos

A estrutura de permissões depende de alguns outros sistemas Backstage, que devem ser configurados antes que possamos mergulhar na escrita de uma política.

### :white_check_mark:  Atualize para a versão mais recente do Backstage

<a href="https://backstage.github.io/upgrade-helper/" style="background: linear-gradient(#4FAAFF,#2c8ce0); color: white; padding: 10px 40px; border: none; border-radius:10px; font-weight: bold; font-size: 18px; text-decoration: none;">Backstage upgrade helper :eyes:</a>



### 1 - Ativar autenticação de back-end para back-end

- A "**Backend-to-backend authentication**" permite que o código de back-end do Backstage verifique se uma determinada solicitação se origina de outro local no back-end do Backstage. Isso é útil para tarefas como agrupamento de entidades de catálogo no índice de pesquisa. Esse tipo de solicitação não deve ter permissão, portanto, é importante configurar esse recurso antes de tentar usar a estrutura de permissões.



#### Backend-to-Backend Authentication

- Este tutorial descreve as etapas necessárias para lidar *com a autenticação de back-end para back-end* , que permite que os back-ends de plug-in determinem se uma determinada solicitação se origina de um back-end legítimo do Backstage, verificando um token assinado com um segredo compartilhado. Este sistema tem uso limitado por enquanto, mas será necessário para dar suporte à próxima estrutura de permissões e autorização

- Os back-ends não têm o conceito de identidade do Backstage, então, em vez disso, eles usam um token gerado usando uma chave compartilhada armazenada em config. Você pode gerar uma chave exclusiva para seu aplicativo em um terminal e definir a `BACKEND_SECRET`variável de ambiente para o valor resultante.

  ```bash
  node -p 'require("crypto").randomBytes(24).toString("base64")'
  ```

**NOTA** : Para facilitar o desenvolvimento, é gerado automaticamente uma chave, caso não tenha configurado um **secret** no modo dev. Você *deve definir seu próprio **secret*** para que a autenticação de back-end para back-end funcione na produção.

As solicitações originadas de um plug-in de back-end podem ser autenticadas decorando-as com um token de back-end. Os tokens de back-end podem ser gerados usando um `TokenManager`, que pode ser passado para back-ends de plug-in por meio do `PluginEnvironment`. O `TokenManager`fornecido nas novas instâncias do Backstage geradas por `create-app`é um stub, que retorna tokens vazios e aceita qualquer string de entrada como válida. Para habilitar a autenticação de back-end para back-end, você precisará instanciar uma nova usando o segredo da sua configuração:

```diff
// packages/backend/src/index.ts

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);

  root.info(`Created UrlReader ${reader}`);

  const cacheManager = CacheManager.fromConfig(config);
  const databaseManager = DatabaseManager.fromConfig(config);
- const tokenManager = ServerTokenManager.noop();
+ const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
```

Com isso `tokenManager`, você pode gerar um token de servidor para solicitações:

```typescript
const { token } = await this.tokenManager.getToken();

const response = await fetch(pluginBackendApiUrl, {
  method: 'GET',
  headers: {
    ...headers,
    Authorization: `Bearer ${token}`,
  },
});
```

Você pode usar o mesmo `tokenManager`para autenticar tokens fornecidos em solicitações recebidas:

```typescript
await tokenManager.authenticate(token); // throws if token is invalid
```


<hr>

### 1.2 - Forneça um "identity resolver" para preencher a associação ao grupo ao entrar



- Como muitas outras partes do Backstage, a estrutura de permissões depende de informações sobre a associação ao grupo. Isso simplifica as políticas de autoria por meio do uso de grupos, em vez de exigir que cada usuário seja listado na configuração. A associação ao grupo também costuma ser útil para permissões condicionais, por exemplo, permitir que as permissões atuem em uma entidade a ser concedida quando um usuário for membro de um grupo que possui essa entidade.

  

<a href="https://backstage.io/docs/auth/identity-resolver" style="background: linear-gradient(#4FAAFF,#2c8ce0); color: white; padding: 10px 40px; border: none; border-radius:10px; font-weight: bold; font-size: 18px; text-decoration: none;">Doc sobre Identify Resolver </a>



### Opcionalmente, adicione autenticação baseada em cookies

As solicitações de ativos iniciadas pelo navegador não incluirão um token no `Authorization`cabeçalho. Se essas solicitações verificarem a autorização por meio da estrutura de permissão, como feito em plug-ins como o TechDocs, você precisará configurar a **autenticação baseada em cookies**. 

### Autenticar solicitações de API

As solicitações de API de plug-ins de front-end incluem um cabeçalho de autorização com um token de identidade do Backstage adquirido quando o usuário faz login. Ao adicionar um middleware que verifica se o token é válido e assinado pelo Backstage, solicitações não autenticadas podem ser bloqueadas com uma resposta 401 Unauthorized.

**NOTA** : Ativar isso significa que o Backstage deixará de funcionar para os convidados, pois nenhum token será emitido para eles.

Como as páginas HTML do techdocs carregam ativos sem um cabeçalho de autorização, o código abaixo também define um cookie de token quando o usuário faz login (e quando o token está prestes a expirar).

```tsx
// packages/backend/src/index.ts from a create-app deployment

import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { JWT } from 'jose';
import { URL } from 'url';
import {
  IdentityClient,
  getBearerTokenFromAuthorizationHeader,
} from '@backstage/plugin-auth-node';

// ...

function setTokenCookie(
  res: Response,
  options: { token: string; secure: boolean; cookieDomain: string },
) {
  try {
    const payload = JWT.decode(options.token) as object & {
      exp: number;
    };
    res.cookie(`token`, options.token, {
      expires: new Date(payload?.exp ? payload?.exp * 1000 : 0),
      secure: options.secure,
      sameSite: 'lax',
      domain: options.cookieDomain,
      path: '/',
      httpOnly: true,
    });
  } catch (_err) {
    // Ignore
  }
}

async function main() {
  // ...

  const discovery = SingleHostDiscovery.fromConfig(config);
  const identity = IdentityClient.create({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });
  const baseUrl = config.getString('backend.baseUrl');
  const secure = baseUrl.startsWith('https://');
  const cookieDomain = new URL(baseUrl).hostname;
  const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token =
        getBearerTokenFromAuthorizationHeader(req.headers.authorization) ||
        req.cookies['token'];
      req.user = await identity.authenticate(token);
      if (!req.headers.authorization) {
        // Authorization header may be forwarded by plugin requests
        req.headers.authorization = `Bearer ${token}`;
      }
      if (token !== req.cookies['token']) {
        setTokenCookie(res, {
          token,
          secure,
          cookieDomain,
        });
      }
      next();
    } catch (error) {
      res.status(401).send(`Unauthorized`);
    }
  };

  const apiRouter = Router();
  apiRouter.use(cookieParser());
  // The auth route must be publicly available as it is used during login
  apiRouter.use('/auth', await auth(authEnv));
  // Add a simple endpoint to be used when setting a token cookie
  apiRouter.use('/cookie', authMiddleware, (_req, res) => {
    res.status(200).send(`Coming right up`);
  });
  // Only authenticated requests are allowed to the routes below
  apiRouter.use('/catalog', authMiddleware, await catalog(catalogEnv));
  apiRouter.use('/techdocs', authMiddleware, await techdocs(techdocsEnv));
  apiRouter.use('/proxy', authMiddleware, await proxy(proxyEnv));
  apiRouter.use(authMiddleware, notFoundHandler());

  // ...
}
```



```tsx
// packages/app/src/App.tsx from a create-app deployment

import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';

// ...

// Parses supplied JWT token and returns the payload
function parseJwt(token: string): { exp: number } {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// Returns milliseconds until the supplied JWT token expires
function msUntilExpiry(token: string): number {
  const payload = parseJwt(token);
  const remaining =
    new Date(payload.exp * 1000).getTime() - new Date().getTime();
  return remaining;
}

// Calls the specified url regularly using an auth token to set a token cookie
// to authorize regular HTTP requests when loading techdocs
async function setTokenCookie(url: string, identityApi: IdentityApi) {
  const { token } = await identityApi.getCredentials();
  if (!token) {
    return;
  }

  await fetch(url, {
    mode: 'cors',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Call this function again a few minutes before the token expires
  const ms = msUntilExpiry(token) - 4 * 60 * 1000;
  setTimeout(
    () => {
      setTokenCookie(url, identityApi);
    },
    ms > 0 ? ms : 10000,
  );
}

const app = createApp({
  // ...

  components: {
    SignInPage: props => {
      const discoveryApi = useApi(discoveryApiRef);
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
          onSignInSuccess={async (identityApi: IdentityApi) => {
            setTokenCookie(
              await discoveryApi.getBaseUrl('cookie'),
              identityApi,
            );

            props.onSignInSuccess(identityApi);
          }}
        />
      );
    },
  },

  // ...
});

// ...
```



**NOTA** : A maioria dos plugins frontend Backstage vem com suporte para o `IdentityApi`. Caso você já tenha uma dúzia de internos, talvez seja necessário atualizá-los também. Supondo que você siga a estrutura comum de plugins, as alterações no seu front-end podem se parecer com:

```diff
// plugins/internal-plugin/src/api.ts
-  import { createApiRef } from '@backstage/core-plugin-api';
+  import { createApiRef, IdentityApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
// ...

type MyApiOptions = {
    configApi: Config;
+   identityApi: IdentityApi;
    // ...
}

interface MyInterface {
    getData(): Promise<MyData[]>;
}

export class MyApi implements MyInterface {
    private configApi: Config;
+   private identityApi: IdentityApi;
    // ...

    constructor(options: MyApiOptions) {
        this.configApi = options.configApi;
+       this.identityApi = options.identityApi;
    }

    async getMyData() {
        const backendUrl = this.configApi.getString('backend.baseUrl');

+       const { token } = await this.identityApi.getCredentials();
        const requestUrl = `${backendUrl}/api/data/`;
-       const response = await fetch(requestUrl);
+       const response = await fetch(
          requestUrl,
          { headers: { Authorization: `Bearer ${token}` } },
        );
    // ...
   }
```

e

```diff
// plugins/internal-plugin/src/plugin.ts

import {
    configApiRef,
    createApiFactory,
    createPlugin,
+   identityApiRef,
} from '@backstage/core-plugin-api';
import { myPluginPageRouteRef } from './routeRefs';
import { MyApi, myApiRef } from './api';

export const plugin = createPlugin({
    id: 'my-plugin',
    routes: {
        mainPage: myPluginPageRouteRef,
    },
    apis: [
        createApiFactory({
            api: myApiRef,
            deps: {
                configApi: configApiRef,
+               identityApi: identityApiRef,
            },
-           factory: ({ configApi }) =>
-               new MyApi({ configApi }),
+           factory: ({ configApi, identityApi }) =>
+               new MyApi({ configApi, identityApi }),
        }),
    ],
});
```



<hr>

### 1.3 Integrando a estrutura de permisão com a sua instância do Backstage



#### 1- Configure o back-end de permissão

A estrutura de permissões usa um novo `permission-backend`plug-in para aceitar solicitações de autorização de outros plug-ins em sua instância do Backstage. **O back-end do Backstage não inclui esse back-end de permissão por padrão, portanto, você precisará adicioná-lo:**



##### 1- Adicione `@backstage/plugin-permission-backend`como uma dependência do back-end do Backstage:

```bash
$ yarn workspace backend add @backstage/plugin-permission-backend
```



##### 2- Adicione o seguinte a um novo arquivo, `packages/backend/src/plugins/permission.ts`. Isso adiciona o roteador de back-end de permissão e o configura com uma política que permite tudo.

```typescript
import { IdentityClient } from '@backstage/plugin-auth-node';
import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

class TestPermissionPolicy implements PermissionPolicy {
  async handle(): Promise<PolicyDecision> {
    return { result: AuthorizeResult.ALLOW };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new TestPermissionPolicy(),
    identity: IdentityClient.create({
      discovery: env.discovery,
      issuer: await env.discovery.getExternalBaseUrl('auth'),
    }),
  });
}
```

##### 3-Conecte a política de permissão em `packages/backend/src/index.ts`:

```js
/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import Router from 'express-promise-router';
import {
  CacheManager,
  createServiceBuilder,
  getRootLogger,
  loadBackendConfig,
  notFoundHandler,
  DatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  useHotMemoize,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import { metricsInit, metricsHandler } from './metrics';
import auth from './plugins/auth';
import azureDevOps from './plugins/azure-devops';
import catalog from './plugins/catalog';
import codeCoverage from './plugins/codecoverage';
import kubernetes from './plugins/kubernetes';
import kafka from './plugins/kafka';
import rollbar from './plugins/rollbar';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import search from './plugins/search';
import techdocs from './plugins/techdocs';
import techInsights from './plugins/techInsights';
import todo from './plugins/todo';
import graphql from './plugins/graphql';
import app from './plugins/app';
import badges from './plugins/badges';
import jenkins from './plugins/jenkins';
import permission from './plugins/permission';
import { PluginEnvironment } from './types';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });
  const databaseManager = DatabaseManager.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);
  const taskScheduler = TaskScheduler.fromConfig(config);

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);
    return {
      logger,
      cache,
      database,
      config,
      reader,
      discovery,
      tokenManager,
      permissions,
      scheduler,
    };
  };
}

async function main() {
  metricsInit();
  const logger = getRootLogger();

  logger.info(
    `You are running an example backend, which is supposed to be mainly used for contributing back to Backstage. ` +
      `Do NOT deploy this to production. Read more here https://backstage.io/docs/getting-started/`,
  );

  const config = await loadBackendConfig({
    argv: process.argv,
    logger,
  });

  const createEnv = makeCreateEnv(config);

  const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const codeCoverageEnv = useHotMemoize(module, () =>
    createEnv('code-coverage'),
  );
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const azureDevOpsEnv = useHotMemoize(module, () => createEnv('azure-devops'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const rollbarEnv = useHotMemoize(module, () => createEnv('rollbar'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const todoEnv = useHotMemoize(module, () => createEnv('todo'));
  const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
  const kafkaEnv = useHotMemoize(module, () => createEnv('kafka'));
  const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const badgesEnv = useHotMemoize(module, () => createEnv('badges'));
  const jenkinsEnv = useHotMemoize(module, () => createEnv('jenkins'));
  const techInsightsEnv = useHotMemoize(module, () =>
    createEnv('tech-insights'),
  );
  const permissionEnv = useHotMemoize(module, () => createEnv('permission'));

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv));
  apiRouter.use('/code-coverage', await codeCoverage(codeCoverageEnv));
  apiRouter.use('/rollbar', await rollbar(rollbarEnv));
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  apiRouter.use('/tech-insights', await techInsights(techInsightsEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/azure-devops', await azureDevOps(azureDevOpsEnv));
  apiRouter.use('/search', await search(searchEnv));
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/todo', await todo(todoEnv));
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
  apiRouter.use('/kafka', await kafka(kafkaEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/graphql', await graphql(graphqlEnv));
  apiRouter.use('/badges', await badges(badgesEnv));
  apiRouter.use('/jenkins', await jenkins(jenkinsEnv));
  apiRouter.use('/permission', await permission(permissionEnv));
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('', metricsHandler())
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
```

###### Você precisará importar o módulo da etapa anterior, criar um ambiente de plug-in e adicionar o roteador ao aplicativo expresso:

```diff
  import proxy from './plugins/proxy';
  import techdocs from './plugins/techdocs';
  import search from './plugins/search';
+ import permission from './plugins/permission';

  ...

  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
+ const permissionEnv = useHotMemoize(module, () => createEnv('permission'));

  ...

  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/search', await search(searchEnv));
+ apiRouter.use('/permission', await permission(permissionEnv));
```



### 2. Habilite e teste o sistema de permissões

Agora que o back-end de permissão está em execução, é hora de habilitar a estrutura de permissões e verificar se está funcionando corretamente.

1. Defina a propriedade `permission.enabled`como `true`em `app-config.yaml`.

```yaml
permission:
  enabled: true
```

1. Atualize a PermissionPolicy `packages/backend/src/plugins/permission.ts`para desabilitar uma permissão que seja fácil de testar. Esta política rejeita qualquer tentativa de excluir uma entidade de catálogo:

```diff
  import { IdentityClient } from '@backstage/plugin-auth-node';
  import { createRouter } from '@backstage/plugin-permission-backend';
  import {
    AuthorizeResult,
    PolicyDecision,
  } from '@backstage/plugin-permission-common';
-  import { PermissionPolicy } from '@backstage/plugin-permission-node';
+ import {
+   PermissionPolicy,
+   PolicyQuery,
+ } from '@backstage/plugin-permission-node';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(): Promise<PolicyDecision> {
+   async handle(request: PolicyQuery): Promise<PolicyDecision> {
+     if (request.permission.name === 'catalog.entity.delete') {
+       return {
+         result: AuthorizeResult.DENY,
+       };
+     }
+
      return { result: AuthorizeResult.ALLOW };
    }
  }
```

1. Agora que você fez essa alteração, você deve descobrir que a opção de menu de entidade de cancelamento de registro na página de entidade do catálogo está desabilitada.

   ![Página de detalhes da entidade mostrando a entrada do menu de contexto da entidade de cancelamento de registro desabilitada](https://backstage.io/docs/assets/permission/disabled-unregister-entity.png)

Agora que a estrutura está totalmente configurada, você pode criar uma política de permissão que funcione melhor para sua organização, utilizando um método de autorização fornecido ou [escrevendo sua própria política](https://backstage.io/docs/permission/writing-a-policy) !


<hr>

:next_track_button:

# 1.1 Escrevendo uma política de permissão

Anteriormente, foi configurado a estrutura de permissão e feito uma alteração simples no`TestPermissionPolicy`para confirmar que a política está realmente conectada corretamente.

Essa política ficou assim:

```typescript
// packages/backend/src/plugins/permission.ts

class TestPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery): Promise<PolicyDecision> {
    if (request.permission.name === 'catalog.entity.delete') {
      return {
        result: AuthorizeResult.DENY,
      };
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
```

## O que há em uma política?

- O objeto de solicitação do tipo [PolicyQuery](https://backstage.io/docs/reference/plugin-permission-node.policyquery) é um wrapper simples em torno [do objeto Permission](https://backstage.io/docs/reference/plugin-permission-common.permission) . Esse objeto de permissão encapsula informações sobre a ação que o usuário está tentando executar .

- Na política acima, estamos verificando se a ação fornecida é uma ação de exclusão de entidade de catálogo, que é a permissão que os autores do plug-in de catálogo criaram para representar a ação de cancelar o registro de uma entidade de catálogo. Se for esse o caso, devolvemos uma [Decisão Política Definitiva](https://backstage.io/docs/reference/plugin-permission-common.definitivepolicydecision) de DENY. Em todos os outros casos, retornamos ALLOW (resultando em um comportamento de permissão por padrão).

- Conforme confirmamos na seção anterior, sabemos que isso agora nos impede de cancelar o registro de componentes do catálogo. Mas você pode notar que isso impede que *qualquer pessoa* cancele o registro de um componente, o que não é uma política muito realista. Vamos melhorar esta política desativando a ação de cancelamento de registro, a *menos que você seja o proprietário deste componente* .

## Decisões condicionais

Vamos alterar a política para o seguinte:

```diff
- import { IdentityClient } from '@backstage/plugin-auth-node';
+ import {
+   BackstageIdentityResponse,
+   IdentityClient
+ } from '@backstage/plugin-auth-node';
  import {
  AuthorizeResult,
  PolicyDecision,
+ isPermission,
} from '@backstage/plugin-permission-common';
+ import {
+   catalogConditions,
+   createCatalogConditionalDecision,
+ } from '@backstage/plugin-catalog-backend';
+ import {
+   catalogEntityDeletePermission,
+ } from '@backstage/plugin-catalog-common';

  ...

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(request: PolicyQuery): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyQuery,
+     user?: BackstageIdentityResponse,
+    ): Promise<PolicyDecision> {
-     if (request.permission.name === 'catalog.entity.delete') {
+     if (isPermission(request.permission, catalogEntityDeletePermission)) {
-       return {
-         result: AuthorizeResult.DENY,
-       };
+       return createCatalogConditionalDecision(
+         request.permission,
+         catalogConditions.isEntityOwner(
+           user?.identity.ownershipEntityRefs ?? [],
+         ),
+       );
      }

      return { result: AuthorizeResult.ALLOW };
    }
  }
```

Vamos percorrer o novo código que acabamos de adicionar.

Em vez de retornar uma Decisão de Política Definitiva, usamos **factory methods** para construir uma [Decisão de Política Condicional](https://backstage.io/docs/reference/plugin-permission-common.conditionalpolicydecision).  Como a política não tem informações suficientes para determinar se `user`é o proprietário da entidade, esse critério é encapsulado na decisão condicional. No entanto, `createCatalogConditionalDecision`não compilará a menos que `request.permission`seja uma entidade de catálogo [`ResourcePermission`](https://backstage.io/docs/reference/plugin-permission-common.resourcepermission). Essa restrição de tipo garante que as políticas retornem decisões condicionais compatíveis com a permissão solicitada. Para resolver isso, usamos [`isPermission`](https://backstage.io/docs/reference/plugin-permission-common.ispermission)para ["restringir"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) o tipo de `request.permission`to `ResourcePermission<'catalog-entity'>`. Isso corresponde ao comportamento de tempo de execução que estava em vigor antes, mas você notará que o tipo de`request.permission`mudou no âmbito dessa `if`declaração.

O `catalogConditions`objeto contém todas as regras definidas pelo plug-in do catálogo. Essas regras podem ser combinadas para formar um [`PermissionCriteria`](https://backstage.io/docs/reference/plugin-permission-common.permissioncriteria)objeto, mas para este caso só precisamos usar a `isEntityOwner`regra. Essa regra aceita uma lista de referências de entidade que representam a identidade do usuário e a associação ao grupo usadas para determinar a propriedade. O segundo argumento para `PermissionPolicy#handle`nos fornece um `BackstageIdentityResponse`objeto, do qual podemos pegar o arquivo `ownershipEntityRefs`. Fornecemos uma matriz vazia como um substituto, pois o usuário pode ser anônimo.

Agora você deve poder ver em seu aplicativo Backstage que o botão de cancelamento de registro de entidade está ativado para entidades que você possui, mas desativado para todas as outras entidades!

## Tipos de recursos

Agora, digamos que queremos impedir todas as ações nas entidades do catálogo, a menos que sejam executadas pelo proprietário. Uma maneira de conseguir isso pode ser simplesmente atualizar a `if`instrução e verificar cada permissão. Se você optar por escrever sua apólice dessa maneira, certamente funcionará! No entanto, pode ser difícil manter à medida que a política cresce e pode não ser óbvio se certas permissões forem deixadas de fora. Podemos criar essa mesma política de maneira mais escalável verificando o tipo de recurso da permissão solicitada.

```diff
import {
  AuthorizeResult,
  PolicyDecision,
- isPermission,
+ isResourcePermission,
} from '@backstage/plugin-permission-common';
 import {
   catalogConditions,
   createCatalogConditionalDecision,
 } from '@backstage/plugin-catalog-backend';
- import {
-   catalogEntityDeletePermission,
- } from '@backstage/plugin-catalog-common';

...

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
-   if (isPermission(request.permission, catalogEntityDeletePermission)) {
+   if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner(
          user?.identity.ownershipEntityRefs ?? [],
        ),
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
```

Neste exemplo, usamos [`isResourcePermission`](https://backstage.io/docs/reference/plugin-permission-common.isresourcepermission)para corresponder todas as permissões com um tipo de recurso de `catalog-entity`. Assim como `isPermission`, este helper irá "restringir" o tipo de `request.permission`e habilitar o uso de `createCatalogConditionalDecision`. Além do comportamento que você observou antes, você também deve ver que as entidades do catálogo não são mais visíveis, a menos que você seja o proprietário - sucesso!

*Observação:* algumas permissões de catálogo não têm o `'catalog-entity'`tipo de recurso, como [`catalogEntityCreatePermission`](https://github.com/backstage/backstage/blob/1e5e9fb9de9856a49e60fc70c38a4e4e94c69570/plugins/catalog-common/src/permissions.ts#L49). Nesses casos, é necessária uma decisão definitiva porque as condições não podem ser aplicadas a uma entidade que ainda não existe.

<hr>



# 1.2 Definindo regras de permissão personalizadas



> Para alguns casos de uso, você pode querer definir [regras](https://backstage.io/docs/permission/concepts#resources-and-rules) personalizadas além daquelas fornecidas por um plugin. Na etapa anterior, usamos a `isEntityOwner`regra para controlar o acesso das entidades do catálogo. Vamos estender essa política com uma regra personalizada que verifica de qual [sistema](https://backstage.io/docs/features/software-catalog/system-model#system) uma entidade faz parte.

## Definir uma regra personalizada

Os plug-ins devem exportar uma fábrica de regras que forneça segurança de tipo que garanta a compatibilidade com o back-end do plug-in. O plug-in do catálogo exporta `createCatalogPermissionRule`de `@backstage/plugin-catalog-backend/alpha`para essa finalidade. Nota: o `/alpha`segmento de caminho é temporário até que esta API seja marcada como estável. Para este exemplo, definiremos a regra em `packages/backend/src/plugins/permission.ts`, mas você pode colocá-la em qualquer lugar acessível pelo seu `backend`pacote.

```typescript
import type { Entity } from '@backstage/plugin-catalog-model';
import { createCatalogPermissionRule } from '@backstage/plugin-catalog-backend';
import { createConditionFactory } from '@backstage/plugin-permission-node';

export const isInSystemRule = createCatalogPermissionRule({
  name: 'IS_IN_SYSTEM',
  description: 'Checks if an entity is part of the system provided',
  resourceType: 'catalog-entity',
  apply: (resource: Entity, systemRef: string) => {
    if (!resource.relations) {
      return false;
    }

    return resource.relations
      .filter(relation => relation.type === 'partOf')
      .some(relation => relation.targetRef === systemRef);
  },
  toQuery: (systemRef: string) => ({
    key: 'relations.partOf',
    value: systemRef,
  }),
});

const isInSystem = createConditionFactory(isInSystemRule);
```

Para uma explicação mais detalhada sobre a definição de regras, consulte a [documentação para autores de plugins](https://backstage.io/docs/permission/plugin-authors/03-adding-a-resource-permission-check#adding-support-for-conditional-decisions) .

## Forneça a regra durante a configuração do plug-in

Agora que temos uma regra personalizada definida, precisamos fornecê-la ao plug-in do catálogo. Esta etapa é importante porque o plug-in do catálogo usará as regras `toQuery`e `apply`métodos ao avaliar os resultados de autorização condicional. Não há garantia de que o catálogo e os back-ends de permissão estejam sendo executados no mesmo servidor, portanto, devemos vincular explicitamente a regra para garantir que ela esteja disponível em tempo de execução.

A API para fornecer regras personalizadas pode diferir entre os plug-ins, mas normalmente deve haver algum ponto de integração durante a criação do roteador de back-end. Para o catálogo, esse ponto de integração é exposto via `CatalogBuilder.addPermissionRules`.

```typescript
// packages/backend/src/plugins/catalog.ts

import { isInSystemRule } from './permission';

...

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addPermissionRules(isInSystem);
  ...
  return router;
}
```

A nova regra agora está pronta para uso em uma política de permissão!

## Usar a regra em uma política

Vamos reunir tudo isso estendendo a política de exemplo da seção anterior.

```diff
// packages/backend/src/plugins/permission.ts

+ import { isInSystem } from './catalog';

...

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isResourcePermission(request.permission, 'catalog-entity')) {
      return createCatalogConditionalDecision(
        request.permission,
-       catalogConditions.isEntityOwner(
-         user?.identity.ownershipEntityRefs ?? [],
-       ),
+       {
+         anyOf: [
+           catalogConditions.isEntityOwner(
+             user?.identity.ownershipEntityRefs ?? []
+           ),
+           isInSystem('interviewing')
+         ]
+       }
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
```

A política atualizada permitirá permissões de recurso de entidade de catálogo se alguma das seguintes condições for verdadeira:

- O usuário é proprietário da entidade de destino
- A entidade alvo faz parte do `'interviewing'`sistema



<hr>



# 1. Configuração do tutorial



> O tutorial a seguir foi desenvolvido para ajudar os autores de plug-ins a adicionar suporte para permissões a seus plug-ins. Adicionaremos suporte para permissões de exemplo `todo-list`e `todo-list-backend`plugins, mas o processo deve ser semelhante para outros plugins!



## Configuração para o tutorial

Usaremos um recurso "Todo list", composto pelos plugins `todo-list`e `todo-list-backend`, bem como sua dependência, `todo-list-common`.

O código fonte está disponível aqui:

- [lista de afazeres](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list)
- [backend de lista de tarefas](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list-backend)
- [lista de tarefas comum](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list-common)

1. Copie e cole as três pastas na pasta de plugins do seu repositório de aplicativos backstage (removendo o `example-`prefixo de cada pasta) ou execute o seguinte script na raiz do seu aplicativo backstage:

   ```bash
   $ cd $(mktemp -d)
     git clone --depth 1 --quiet --no-checkout --filter=blob:none https://github.com/backstage/backstage.git .
     git checkout master -- plugins/example-todo-list/
     git checkout master -- plugins/example-todo-list-backend/
     git checkout master -- plugins/example-todo-list-common/
     for file in plugins/*; do mv "$file" "$OLDPWD/${file/example-todo/todo}"; done
     cd -
   ```

   O `plugins`diretório do seu projeto agora deve incluir `todo-list`, `todo-list-backend`e `todo-list-common`.

   **Importante** : se você estiver no **Windows** , certifique-se de ter o WSL e o git instalados em sua máquina antes de executar o script acima.

2. Adicione estes pacotes como dependências para seu aplicativo Backstage:

   ```
   $ yarn workspace backend add @internal/plugin-todo-list-backend@^1.0.0 @internal/plugin-todo-list-common@^1.0.0
   $ yarn workspace app add @internal/plugin-todo-list@^1.0.0
   ```

3. Inclua o plug-in de back-end e front-end em seu aplicativo:

   Crie um novo `packages/backend/src/plugins/todolist.ts`com o seguinte conteúdo:

   ```javascript
   import { IdentityClient } from '@backstage/plugin-auth-node';
   import { createRouter } from '@internal/plugin-todo-list-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
   
   export default async function createPlugin({
     logger,
     discovery,
   }: PluginEnvironment): Promise<Router> {
     return await createRouter({
       logger,
       identity: IdentityClient.create({
         discovery,
         issuer: await discovery.getExternalBaseUrl('auth'),
       }),
     });
   }
   ```

   Aplique as seguintes alterações a `packages/backend/src/index.ts`:

   ```diff
     import techdocs from './plugins/techdocs';
   + import todoList from './plugins/todolist';
     import search from './plugins/search';
   
     ...
   
     const searchEnv = useHotMemoize(module, () => createEnv('search'));
     const appEnv = useHotMemoize(module, () => createEnv('app'));
   + const todoListEnv = useHotMemoize(module, () => createEnv('todolist'));
   
     ...
   
     apiRouter.use('/proxy', await proxy(proxyEnv));
     apiRouter.use('/search', await search(searchEnv));
     apiRouter.use('/permission', await permission(permissionEnv));
   + apiRouter.use('/todolist', await todoList(todoListEnv));
     // Add backends ABOVE this line; this 404 handler is the catch-all fallback
     apiRouter.use(notFoundHandler());
   ```

   Aplique as seguintes alterações a `packages/app/src/App.tsx`:

   ```diff
   + import { TodoListPage } from '@internal/plugin-todo-list';
   
   ...
   
       <Route path="/search" element={<SearchPage />}>
         {searchPage}
       </Route>
       <Route path="/settings" element={<UserSettingsPage />} />
   +   <Route path="/todo-list" element={<TodoListPage />} />
     </FlatRoutes>
   ```

Agora, se você iniciar seu aplicativo, poderá acessar a `/todo-list`página:

![Página do plug-in da lista de tarefas](https://backstage.io/docs/assets/permission/permission-todo-list-page.png)



## Integrar o novo plug-in

Se você jogar com a interface do usuário, notará que é possível realizar algumas ações:

- criar um novo item de tarefas ( `POST /todos`)
- ver itens de tarefas ( `GET /todos`)
- editar um item de tarefas existente ( `PUT /todos`)

Vamos tentar trazer autorização em cima de cada um deles.



# 2. Adicionando uma verificação de permissão básica



**Se o resultado de uma verificação de permissão não precisar ser alterado para [recursos](https://backstage.io/docs/permission/concepts#resources-and-rules) diferentes** , você poderá usar uma ***verificação de permissão básica*** . Para esse tipo de verificação, basta definir uma [permissão](https://backstage.io/docs/permission/concepts#resources-and-rules) e chamá-la `authorize`.

Para este tutorial, usaremos uma verificação de permissão básica para autorizar o `create`endpoint em nosso todo-backend. Isso permitirá que os integradores do Backstage controlem se cada um de seus usuários está autorizado a criar todos, ajustando sua [política de permissão](https://backstage.io/docs/permission/concepts#policy) .

Começaremos criando uma nova permissão e, em seguida, usaremos a API de permissão **authorize** para chamá-la durante a criação de tarefas.

## Criando uma nova permissão

Vamos navegar até o arquivo `plugins/todo-list-common/src/permissions.ts`e adicionar nossa primeira permissão:

```diff
  import { createPermission } from '@backstage/plugin-permission-common';

- export const tempExamplePermission = createPermission({
-   name: 'temp.example.noop',
-   attributes: {},
+ export const todoListCreate = createPermission({
+   name: 'todo.list.create',
+   attributes: { action: 'create' },
  });
```

Para este tutorial, exportamos automaticamente todas as permissões deste arquivo (consulte Recursos `plugins/todo-list-common/src/index.ts`).

> Nota: Todas as permissões autorizadas pelo seu plugin devem ser exportadas de um [pacote "common-library"](https://backstage.io/docs/local-dev/cli-build-system#package-roles) . Isso permite que os integradores do Backstage façam referência a eles em componentes de front-end e políticas de permissão.



## Autorizando usando a nova permissão

Instale o seguinte módulo:

```
$ yarn workspace @internal/plugin-todo-list-backend \
  add @backstage/plugin-permission-common @internal/plugin-todo-list-common
```

Editar `plugins/todo-list-backend/src/service/router.ts`:

```diff
...

- import { InputError } from '@backstage/errors';
+ import { InputError, NotAllowedError } from '@backstage/errors';
+ import { PermissionEvaluator, AuthorizeResult } from '@backstage/plugin-permission-common';
+ import { todoListCreate } from '@internal/plugin-todo-list-common';

...

  export interface RouterOptions {
    logger: Logger;
    identity: IdentityClient;
+   permissions: PermissionEvaluator;
  }

  export async function createRouter(
    options: RouterOptions,
  ): Promise<express.Router> {
-   const { logger, identity } = options;
+   const { logger, identity, permissions } = options;

    ...

    router.post('/todos', async (req, res) => {
      const token = IdentityClient.getBearerToken(req.header('authorization'));
      let author: string | undefined = undefined;

      const user = token ? await identity.authenticate(token) : undefined;
      author = user?.identity.userEntityRef;
+     const decision = (
+       await permissions.authorize([{ permission: todoListCreate }], {
+       token,
+       })
+     )[0];

+     if (decision.result === AuthorizeResult.DENY) {
+       throw new NotAllowedError('Unauthorized');
+     }

      if (!isTodoCreateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }

      const todo = add({ title: req.body.title, author });
      res.json(todo);
  });
```

Passe o objeto `permissions` para o plugin em `packages/backend/src/plugins/todolist.ts`:

```diff
  import { IdentityClient } from '@backstage/plugin-auth-backend';
  import { createRouter } from '@internal/plugin-todo-list-backend';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    discovery,
+   permissions,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      identity: new IdentityClient({
        discovery,
        issuer: await discovery.getExternalBaseUrl('auth'),
      }),
+     permissions,
    });
  }
```

É isso! Agora seu plugin está totalmente configurado. Vamos tentar testar a lógica negando a permissão.

## Testar o endpoint de criação autorizado

Antes de executar esta etapa, certifique-se de seguir as etapas descritas na seção [Introdução](https://backstage.io/docs/permission/getting-started) .

Para testar a lógica acima, os integradores de sua instância de backstage precisam alterar sua política de permissão para retornar `DENY`à nossa permissão recém-criada:

```diff
// packages/backend/src/plugins/permission.ts

- import { IdentityClient } from '@backstage/plugin-auth-node';
+ import {
+   BackstageIdentityResponse,
+   IdentityClient
+ } from '@backstage/plugin-auth-node';
  import {
    PermissionPolicy,
+   PolicyQuery,
  } from '@backstage/plugin-permission-node';
+ import { isPermission } from '@backstage/plugin-permission-common';
+ import { todoListCreate } from '@internal/plugin-todo-list-common';

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyQuery,
+     user?: BackstageIdentityResponse,
+   ): Promise<PolicyDecision> {
+     if (isPermission(request.permission, todoListCreate)) {
+       return {
+         result: AuthorizeResult.DENY,
+       };
+     }
+
      return {
        result: AuthorizeResult.ALLOW,
      };
  }
```

Agora, o frontend deve mostrar um erro sempre que você tentar criar um novo item Todo.

Vamos inverter o resultado para `ALLOW`antes de prosseguir.

```diff
  if (isPermission(request.permission, todoListCreate)) {
    return {
-     result: AuthorizeResult.DENY,
+     result: AuthorizeResult.ALLOW,
    };
  }
```



# 3. Adicionando uma verificação de permissão de recurso



> Ao realizar atualizações (ou outras operações) em [recursos](https://backstage.io/docs/permission/concepts#resources-and-rules) específicos , a estrutura de permissões permite que a decisão seja baseada nas características do próprio recurso. Isso significa que é possível escrever políticas que (por exemplo) permitem a operação para usuários que possuem um recurso e negam a operação de outra forma.[
> ](https://backstage.io/docs/permission/plugin-authors/03-adding-a-resource-permission-check#creating-the-update-permission)

## Criando a permissão de atualização

Vamos adicionar uma nova permissão ao arquivo `plugins/todo-list-common/src/permissions.ts`da seção anterior.

```diff
  import { createPermission } from '@backstage/plugin-permission-common';

+ export const TODO_LIST_RESOURCE_TYPE = 'todo-item';
+
  export const todoListCreate = createPermission({
    name: 'todo.list.create',
    attributes: { action: 'create' },
  });
+
+ export const todoListUpdate = createPermission({
+   name: 'todo.list.update',
+   attributes: { action: 'update' },
+   resourceType: TODO_LIST_RESOURCE_TYPE,
+ });
```

Observe que, ao contrário `todoListCreate`de , a `todoListUpdate`permissão contém um `resourceType`campo. Este campo indica à estrutura de permissão que essa permissão deve ser autorizada no contexto de um recurso com tipo `'todo-item'`. Você pode usar qualquer string que desejar como tipo de recurso, desde que use o mesmo valor de forma consistente para cada tipo de recurso.

## Configurando a autorização para a permissão de atualização

Para começar, vamos editar `plugins/todo-list-backend/src/service/router.ts`da mesma maneira que fizemos na seção anterior:

```diff
- import { todoListCreate } from '@internal/plugin-todo-list-common';
+ import { todoListCreate, todoListUpdate } from '@internal/plugin-todo-list-common';

  ...

    router.put('/todos', async (req, res) => {
+     const token = getBearerTokenFromAuthorizationHeader(
+       req.header('authorization'),
+     );

      if (!isTodoUpdateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }
+     const decision = (
+       await permissions.authorize(
+         [{ permission: todoListUpdate, resourceRef: req.body.id }],
+         {
+           token,
+         },
+       )
+     )[0];
+
+     if (decision.result !== AuthorizeResult.ALLOW) {
+       throw new NotAllowedError('Unauthorized');
+     }

      res.json(update(req.body));
    });
```

**Importante:** Observe que estamos passando um `resourceRef`campo extra, com o `id`valor do item todo.

Isso permite decisões com base nas características do recurso, mas é importante observar que os autores da política não terão acesso ao recurso ref dentro de suas políticas de permissão. Em vez disso, as políticas retornarão decisões condicionais, que agora precisamos oferecer suporte em nosso plug-in.

## Adicionando suporte para decisões condicionais

Instale o módulo ausente:

```
$ yarn workspace @internal/plugin-todo-list-backend add @backstage/plugin-permission-node
```

Crie um novo `plugins/todo-list-backend/src/service/rules.ts`arquivo e anexe o seguinte código:

```typescript
import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import { TODO_LIST_RESOURCE_TYPE } from '@internal/plugin-todo-list-common';
import { Todo, TodoFilter } from './todos';

export const createTodoListPermissionRule = makeCreatePermissionRule<
  Todo,
  TodoFilter
>();

export const isOwner = createTodoListPermissionRule({
  name: 'IS_OWNER',
  description: 'Should allow only if the todo belongs to the user',
  resourceType: TODO_LIST_RESOURCE_TYPE,
  apply: (resource: Todo, userId: string) => {
    return resource.author === userId;
  },
  toQuery: (userId: string) => {
    return {
      property: 'author',
      values: [userId],
    };
  },
});

export const rules = { isOwner };
```

`makeCreatePermissionRule`é um auxiliar usado para garantir que as regras criadas para este plugin usem tipos consistentes para o recurso e a consulta.

> Observação: para oferecer suporte a regras personalizadas definidas pelos integradores do Backstage, você deve exportar `createTodoListPermissionRule`do pacote de back-end e fornecer alguma forma de transmissão de regras personalizadas antes do início do back-end, provavelmente via `createRouter`.

Criamos uma nova `isOwner`regra, que será usada automaticamente pela estrutura de permissão sempre que uma resposta condicional for retornada em resposta a uma solicitação autorizada com um arquivo `resourceRef`. Especificamente, a `apply`função é usada para entender se o recurso passado deve ser autorizado ou não.

Agora, vamos criar o novo endpoint editando `plugins/todo-list-backend/src/service/router.ts`. Isso usa o `createPermissionIntegrationRouter`auxiliar para adicionar as APIs necessárias pela estrutura de permissão ao seu plug-in. Você precisará fornecer:

- `getResources`: uma função que aceita um array de `resourceRefs`no mesmo formato que você espera que seja passado para `authorize`e retorna um array dos recursos correspondentes.
- `resourceType`: o mesmo valor usado na regra de permissão acima.
- `rules`: uma matriz de todas as regras de permissão que você deseja oferecer suporte em decisões condicionais.

```diff
...

- import { add, getAll, update } from './todos';
+ import { add, getAll, getTodo, update } from './todos';
+ import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
+ import { TODO_LIST_RESOURCE_TYPE } from '@internal/plugin-todo-list-common';
+ import { rules } from './rules';

  export async function createRouter(
    options: RouterOptions,
  ): Promise<express.Router> {
    const { logger, identity, permissions } = options;

+   const permissionIntegrationRouter = createPermissionIntegrationRouter({
+     getResources: async resourceRefs => {
+       return resourceRefs.map(getTodo);
+     },
+     resourceType: TODO_LIST_RESOURCE_TYPE,
+     rules: Object.values(rules),
+   });

    const router = Router();
    router.use(express.json());

+   router.use(permissionIntegrationRouter);

    router.post('/todos', async (req, res) => {
```



## Testar o endpoint de atualização autorizado

Vamos voltar para a função handle da política de permissão e tentar autorizar nossa nova permissão com uma `isOwner`condição.

```diff
  // packages/backend/src/plugins/permission.ts

  import {
    BackstageIdentityResponse,
    IdentityClient
  } from '@backstage/plugin-auth-node';
  import {
    PermissionPolicy,
    PolicyQuery,
  } from '@backstage/plugin-permission-node';
  import { isPermission } from '@backstage/plugin-permission-common';
- import { todoListCreate } from '@internal/plugin-todo-list-common';
+ import {
+   todoListCreate,
+   todoListUpdate,
+   TODO_LIST_RESOURCE_TYPE,
+ } from '@internal/plugin-todo-list-common';
+ import {
+   todoListConditions,
+   createTodoListConditionalDecision,
+ } from '@internal/plugin-todo-list-backend';

...

    if (isPermission(request.permission, todoListCreate)) {
      return {
        result: AuthorizeResult.ALLOW,
      };
    }

+   if (isPermission(request.permission, todoListUpdate)) {
+     return createTodoListConditionalDecision(
+       request.permission,
+       todoListConditions.isOwner(user?.identity.userEntityRef),
+     );
+   }
+
    return {
      result: AuthorizeResult.ALLOW,
    };
```

Para qualquer solicitação de atualização recebida, agora retornamos uma *Decisão Condicional* . Estamos dizendo:

> Ei, framework de permissão, não posso tomar uma decisão sozinho. Por favor, vá para o plugin com id `todolist`e peça para aplicar essas condições.

Para verificar se tudo funciona conforme o esperado, você deve ver um erro na interface do usuário sempre que tentar editar um item que não foi criado por você. Sucesso!





# 4. Autorizando o acesso a dados paginados

A autorização `GET /todos`é semelhante ao endpoint de atualização, pois deve ser possível autorizar o acesso com base nas características de cada recurso. No entanto, precisaremos autorizar uma lista de recursos para este endpoint.

Uma solução possível pode alavancar a funcionalidade de lote para autorizar todos os todos e, em seguida, retornar apenas aqueles para os quais a decisão foi `ALLOW`:

```diff
    router.get('/todos', async (req, res) => {
+     const token = IdentityClient.getBearerToken(req.header('authorization'));

-     res.json(getAll())
+     const items = getAll();
+     const decisions = await permissions.authorize(
+       items.map(({ id }) => ({ permission: todosListRead, resourceRef: id })),
+     );

+     const filteredItems = decisions.filter(
+       decision => decision.result === AuthorizeResult.ALLOW,
+     );
+     res.json(filteredItems);
    });
```

Essa abordagem funcionará para casos simples, mas tem uma desvantagem: nos obriga a recuperar todos os elementos antecipadamente e autorizá-los um por um. Isso força a implementação do plug-in a lidar com questões como paginação, que atualmente é tratada pela fonte de dados.

Para evitar essa situação, a estrutura de permissões tem suporte para filtrar itens na própria fonte de dados. Nesta parte do tutorial, descreveremos as etapas necessárias para usar esse comportamento.

> Observação: para realizar a filtragem de autorização dessa maneira, a fonte de dados deve permitir que os filtros sejam combinados logicamente com os operadores AND, OR e NOT. As decisões condicionais retornadas pela estrutura de permissões usam um [objeto aninhado](https://backstage.io/docs/reference/plugin-permission-common.permissioncriteria) para combinar condições. Se você estiver implementando uma API de filtro do zero, recomendamos usar a mesma forma para facilitar a interoperabilidade. Caso contrário, você precisará implementar uma função que transforme o objeto aninhado em seu próprio formato.



## Criando a permissão de leitura

Vamos adicionar outra permissão ao plugin.

```diff
  // plugins/todo-list-backend/src/service/permissions.ts

  import { createPermission } from '@backstage/plugin-permission-common';

  export const TODO_LIST_RESOURCE_TYPE = 'todo-item';

  export const todoListCreate = createPermission({
    name: 'todo.list.create',
    attributes: { action: 'create' },
  });

  export const todoListUpdate = createPermission({
    name: 'todo.list.update',
    attributes: { action: 'update' },
    resourceType: TODO_LIST_RESOURCE_TYPE,
  });
+
+ export const todosListRead = createPermission({
+   name: 'todos.list.read',
+   attributes: { action: 'read' },
+   resourceType: TODO_LIST_RESOURCE_TYPE,
+ });
```

## Como usar decisões de política condicionais

Até agora, usamos apenas o `PermissionEvaluator.authorize`método, que avaliará decisões condicionais antes de retornar um resultado. Nesta etapa, queremos avaliar as decisões condicionais em nosso plug-in, então usaremos `PermissionEvaluator.authorizeConditional`.

```diff
// plugins/todo-list-backend/src/service/router.ts

- import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
+ import {
+   createPermissionIntegrationRouter,
+   createConditionTransformer,
+   ConditionTransformer,
+ } from '@backstage/plugin-permission-node';
- import { add, getAll, getTodo, update } from './todos';
+ import { add, getAll, getTodo, TodoFilter, update } from './todos';
  import {
    todosListCreate,
    todosListUpdate,
+   todosListRead,
    TODO_LIST_RESOURCE_TYPE,
  } from './permissions';
+ import { rules } from './rules';

+ const transformConditions: ConditionTransformer<TodoFilter> = createConditionTransformer(Object.values(rules));

- router.get('/todos', async (_req, res) => {
+ router.get('/todos', async (req, res) => {
+   const token = getBearerTokenFromAuthorizationHeader(
+     req.header('authorization'),
+   );
+
+   const decision = (
+     await permissions.authorizeConditional([{ permission: todosListRead }], {
+       token,
+     })
+   )[0];
+
+   if (decision.result === AuthorizeResult.DENY) {
+     throw new NotAllowedError('Unauthorized');
+   }
+
+   if (decision.result === AuthorizeResult.CONDITIONAL) {
+     const filter = transformConditions(decision.conditions);
+     res.json(getAll(filter));
+   } else {
+     res.json(getAll());
+   }
+ }
-   res.json(getAll());
  });
```

Para facilitar o processo de manipulação de decisões condicionais, a estrutura de permissão fornece um `createConditionTransformer`auxiliar. Esta função aceita um array de regras de permissão e retorna uma função transformadora que converte as condições para o formato necessário para o plugin usando o `toQuery`método definido em cada regra.

Como `TodoFilter`usado em nosso plugin corresponde à estrutura do objeto de condições, podemos passar diretamente a saída do nosso transformador de condição. Se os filtros fossem estruturados de forma diferente, precisaríamos transformá-los ainda mais antes de passá-los para a API.



## Testar o endpoint de leitura autorizado

Vamos atualizar nossa política de permissão para retornar um resultado condicional sempre que uma `todosListRead`permissão for recebida. Nesse caso, podemos reutilizar a decisão retornada para a `todosListCreate`permissão.

```diff
// packages/backend/src/plugins/permission.ts

...

import {
  todoListCreate,
  todoListUpdate,
+ todoListRead,
  TODO_LIST_RESOURCE_TYPE,
} from '@internal/plugin-todo-list-common';

...

-   if (isPermission(request.permission, todoListUpdate)) {
+   if (
+     isPermission(request.permission, todoListUpdate) ||
+     isPermission(request.permission, todoListRead)
+   ) {
      return createTodoListConditionalDecision(
        request.permission,
        todoListConditions.isOwner(user?.identity.userEntityRef),
      );
    }
```

Depois que as alterações na política de permissão forem salvas, a interface do usuário deverá mostrar apenas os itens de tarefas que você criou.

