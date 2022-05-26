# 1 - Autenticação no Backstage  :busts_in_silhouette:

- Dois propósitos distintos: login e identificação de usuários

- É possível configurar o Backstage para ter qualquer número de provedores de autenticação, mas apenas um deles normalmente será usado para entrada, com o restante sendo usado para fornecer acesso a recursos externos.

  

### Configurando provedores de autenticação

- Cada provedor integrado tem um bloco de configuração na `auth`seção de `app-config.yaml`



### Configuração de login

```
OBSERVAÇÃO: o gerenciamento de identidade e o *SignInPageBackstage* NÃO são um método para bloquear o acesso de usuários não autorizados, que requer implementação de back-end adicional ou um serviço separado, como o Identity-Aware Proxy do Google. O sistema de identidade serve apenas para fornecer uma experiência personalizada e acesso a um Backstage Identity Token, que pode ser passado para plugins de backend.
```

- O Login deve ser configurado tanto no front-end quanto no Backend.

  Para configurar a parte do backend :arrow_right: **Identidades de entrada e resolvedores** 

- A entrada é configurada fornecendo um `SignInPage`componente de aplicativo personalizado. Ele será renderizado antes de qualquer outra rota no aplicativo e é responsável por fornecer a identidade do usuário atual.

O `SignInPage`pode renderizar qualquer número de páginas e componentes, ou apenas espaço em branco com lógica rodando em segundo plano. No final, no entanto, ele deve fornecer uma identidade de usuário do Backstage válida por meio da `onSignInSuccess` propriedade de retorno de chamada, ponto em que o restante do aplicativo é renderizado.

Podemos usar o `SignInPage`componente fornecido por `@backstage/core-components`, que recebe uma `provider`ou `providers`(array) prop de `SignInProviderConfig`definições.



```react
 import { githubAuthApiRef } from '@backstage/core-plugin-api';
 import { SignInPage } from '@backstage/core-components';

 const app = createApp({
   apis,
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        provider={{
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        }}
      />
    ),
  },
   bindRoutes({ bind }) {
       
```



## Para desenvolvedores de plug-ins

As APIs principais de front-end do Backstage fornecem um conjunto de APIs de utilitário para os desenvolvedores de plug-ins usarem, tanto para acessar a identidade do usuário quanto para recursos de terceiros.

### Identidade para desenvolvedores de plug-ins

Para desenvolvedores de plugins, há um ponto de contato principal para acessar a identidade do usuário: o `IdentityApi`exportado por `@backstage/core-plugin-api`meio do arquivo `identityApiRef`.

O `IdentityApi`dá acesso à identidade do usuário conectado no frontend. Ele fornece acesso à referência de entidade do usuário, informações de perfil leves e um token Backstage que identifica o usuário ao fazer chamadas autenticadas no Backstage.

Ao fazer chamadas para plugins de back-end, recomendamos que `FetchApi`seja usado o, que é exportado por meio do `fetchApiRef`arquivo `@backstage/core-plugin-api`. O `FetchApi`incluirá automaticamente um token Backstage na solicitação, o que significa que não há necessidade de interagir diretamente com o `IdentityApi`.

### Acessando recursos de terceiros

Um padrão comum para **conversar com serviços de terceiros** no Backstage são as **solicitações de usuário para servidor**, em que os tokens de acesso OAuth de curta duração são solicitados por plug-ins para autenticar chamadas para serviços externos. **Essas chamadas podem ser feitas diretamente para os serviços ou por meio de um plug-in ou serviço de back-end**.

Ao confiar em chamadas de usuário para servidor, mantemos o acoplamento entre o front-end e o back-end baixo e fornecemos uma barreira muito menor para os plug-ins usarem serviços de terceiros. Isso é comparado a, por exemplo, um sistema baseado em sessão, **onde os tokens de acesso são armazenados no lado do servidor**. **Essa solução exigiria um acoplamento muito mais profundo entre o plug-in de back-end de autenticação, seu armazenamento de sessão e outros plug-ins de back-end ou serviços separados**. Um objetivo do Backstage é facilitar ao máximo a criação de novos plugins, e uma solução de autenticação baseada em OAuth de usuário para servidor ajuda nesse sentido.

O método pelo qual os plug-ins de frontend solicitam acesso a serviços de terceiros é por meio de [APIs de utilitário](https://backstage.io/docs/api/utility-apis) para cada provedor de serviços. Estes são todos sufixados com `*AuthApiRef`, por exemplo `githubAuthApiRef`. Para obter uma lista completa de provedores, consulte a referência [@backstage/core-plugin-api](https://backstage.io/docs/reference/core-plugin-api#variables) .



<hr>



# 1.1 Adicionando provedores de autenticação



### Utilizando Passport JS

```
1- Instale o pacote de provedor baseado em passaporte-js.

2- Crie uma nova estrutura de pastas para o provedor.

3- Implemente o provedor, estendendo a estrutura adequada, se necessário.

4- Adicione o provedor ao back-end.
```



> Para instalar um plugin de backend o comando será "yarn backstage-cli create", escolha a opção "criar plugin de backend" e passe o Id obrigatório
>
> | id                | title                           | description                                      |
> | ----------------- | ------------------------------- | ------------------------------------------------ |
> | add-auth-provider | Adding authentication providers | Documentation on Adding authentication providers |



### Instalando as dependências:

```bash
cd plugins/auth-backend
yarn add passport-provider-a
yarn add @types/passport-provider-a
```

### Criar implementação

Crie uma nova pasta com o nome do provedor seguindo a estrutura de arquivos abaixo:

```bash
plugins/auth-backend/src/providers/providerA
├── index.ts
└── provider.ts
```

**`plugins/auth-backend/src/providers/providerA/provider.ts`**define a classe do provedor que implementa um manipulador para o framework escolhido.

#### Adicionando um provedor baseado em OAuth

Se estivermos adicionando um `OAuth`provedor baseado, implementaremos a interface [OAuthProviderHandlers](https://backstage.io/docs/auth/add-auth-provider#OAuthProviderHandlers) . Ao implementar essa interface, podemos usar a `OAuthProvider`classe fornecida por `lib/oauth`, o que significa que não precisamos implementar a interface [AuthProviderRouteHandlers](https://backstage.io/docs/auth/add-auth-provider#AuthProviderRouteHandlers) completa que os provedores precisam implementar.

A classe do provedor usa as opções do provedor como um parâmetro de classe. Ele também importa o `Strategy`pacote do passaporte.

```ts
import { Strategy as ProviderAStrategy } from 'passport-provider-a';

export type ProviderAProviderOptions = OAuthProviderOptions & {
  // extra options here
}

export class ProviderAAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: ProviderAStrategy;

  constructor(options: ProviderAProviderOptions) {
    this._strategy = new ProviderAStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        passReqToCallback: false,
        response_type: 'code',
        /// ... etc
      }
      verifyFunction, // See the "Verify Callback" section
    );
  }

  async start() {}
  async handler() {}
}
```



#### Adicionando um provedor não baseado em OAuth

***Observação** : priorizamos provedores baseados em OAuth e provedores não OAuth devem ser considerados experimentais.*

Um `OAuth`provedor não baseado pode implementar [AuthProviderRouteHandlers](https://backstage.io/docs/auth/add-auth-provider#AuthProviderRouteHandlers) em vez disso.

```ts
type ProviderAOptions = {
  // ...
};

export class ProviderAAuthProvider implements AuthProviderRouteHandlers {
  private readonly _strategy: ProviderAStrategy;

  constructor(options: ProviderAOptions) {
    this._strategy = new ProviderAStrategy(
      {
        // ...
      },
      verifyFunction, // See the "Verify Callback" section
    );
  }

  async start() {}
  async frameHandler() {}
  async logout() {}
  async refresh() {} // If supported
}
```

#### Factory function

Cada provedor exporta uma **factory function** que instancia o provedor. A **factory** deve implementar [AuthProviderFactory](https://backstage.io/docs/auth/add-auth-provider#AuthProviderFactory) , que **passa em um objeto com utilitários para configuração, log, emissão de token, etc**. A **factory** deve retornar uma implementação de [AuthProviderRouteHandlers](https://backstage.io/docs/auth/add-auth-provider#AuthProviderRouteHandlers) .

**A factory** é o que decide o mapeamento desde a [configuração estática](https://backstage.io/docs/conf/) até a criação de provedores de autenticação. Por exemplo, os provedores OAuth `OAuthEnvironmentHandler`permitem várias configurações diferentes, uma para cada ambiente, que se parece com isso;

```ts
export const createOktaProvider: AuthProviderFactory = ({
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    // read options from config
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');

    // instantiate our OAuthProviderHandlers implementation
    const provider = new OktaAuthProvider({
      audience,
      clientId,
      clientSecret,
      callbackUrl,
    });

    // Wrap the OAuthProviderHandlers with OAuthProvider, which implements AuthProviderRouteHandlers
    return OAuthProvider.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      providerId,
      tokenIssuer,
    });
  });
```

A finalidade dos diferentes ambientes é **permitir que um único back-end de autenticação sirva como serviço de autenticação para vários ambientes front-end diferentes, como desenvolvimento local, preparação e produção.**

A função de factory para outros provedores pode ser bem mais simples, pois eles podem não ter configuração para cada ambiente. Olhando algo assim:

```ts
export const createProviderAProvider: AuthProviderFactory = ({ config }) => {
  const a = config.getString('a');
  const b = config.getString('b');

  return new ProviderAAuthProvider({ a, b });
};
```

#### Verificar retorno de chamada

> As estratégias requerem o que é conhecido como callback de verificação. **A finalidade de um retorno de chamada de verificação é encontrar o usuário que possui um conjunto de credenciais. Quando o Passport autentica uma solicitação, ele analisa as credenciais contidas na solicitação**. Em seguida, ele invoca o callback de verificação com essas credenciais como argumentos [...]. Se as credenciais forem válidas, o callback de verificação será invocado para fornecer o Passport com o usuário autenticado.
>
> Se as credenciais não forem válidas (por exemplo, se a senha estiver incorreta), done deve ser invocado com false em vez de um usuário para indicar uma falha de autenticação.
>
> http://www.passportjs.org/docs/configure/

**`plugins/auth-backend/src/providers/providerA/index.ts`**é simplesmente reexportar a função de fábrica a ser usada para conectar o provedor ao back-end.

```ts
export { createProviderAProvider } from './provider';
```

### Conecte-o ao back-end

**`plugins/auth-backend/src/providers/factories.ts`** Ao `auth-backend` iniciar, ele configura o roteamento para todos os provedores disponíveis, chamando `createAuthProviderRouter`cada provedor. basta importar a **factory function** do provedor e adicioná-la à factory:

```ts
import { createProviderAProvider } from './providerA';

const factories: { [providerId: string]: AuthProviderFactory } = {
  providerA: createProviderAProvider,
};
```

Ao fazer isso `auth-backend`, adiciona automaticamente esses endpoints:

```ts
router.get('/auth/providerA/start');
router.get('/auth/providerA/handler/frame');
router.post('/auth/providerA/handler/frame');
router.post('/auth/providerA/logout');
router.get('/auth/providerA/refresh'); // if supported
```

Cada endpoint é prefixado com ambos `/auth`e seu nome de provedor.

### Teste do novo provedor

 `curl -i localhost:7007/api/auth/providerA/start`deve fornecer um `302`redirecionamento com um `Location` no cabeçalho. Cole a URL desse cabeçalho em um navegador da Web e você poderá acionar o fluxo de autorização.

------

##### Manipuladores OAuthProvider

```ts
export interface OAuthProviderHandlers {
  start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo>;
  handler(req: express.Request): Promise<{
    response: AuthResponse<OAuthProviderInfo>;
    refreshToken?: string;
  }>;
  refresh?(
    refreshToken: string,
    scope: string,
  ): Promise<AuthResponse<OAuthProviderInfo>>;
  logout?(): Promise<void>;
}
```

##### AuthProviderRouteHandlers

```ts
export interface AuthProviderRouteHandlers {
  start(req: express.Request, res: express.Response): Promise<any>;
  frameHandler(req: express.Request, res: express.Response): Promise<any>;
  refresh?(req: express.Request, res: express.Response): Promise<any>;
  logout(req: express.Request, res: express.Response): Promise<any>;
}
```

##### AuthProviderFactory

```ts
export type AuthProviderFactoryOptions = {
  globalConfig: AuthProviderConfig;
  config: Config;
  logger: Logger;
  tokenIssuer: TokenIssuer;
};

export type AuthProviderFactory = (
  options: AuthProviderFactoryOptions,
) => AuthProviderRouteHandlers;
```

<hr>

# <span id='identityResolver'>1.2 Sign-in Identities e Resolvers</span>



- **Por padrão, todo provedor de autenticação do Backstage é configurado apenas para o caso de uso de delegação de acesso.** Isso permite que o Backstage solicite recursos e ações de sistemas externos em nome do usuário, por exemplo, reativando uma compilação no CI.
- Se você quiser usar um provedor de autenticação para fazer login de usuários, precisará configurá-lo explicitamente com o login habilitado e também informar como as identidades externas devem ser mapeadas para identidades de usuário no Backstage.

* **Referencia de entidade de usuário e um conjunto de referências de entidade de propriedade**. Quando um usuário entra, um token Backstage é gerado com essas duas informações, que são usadas para identificar o usuário no ecossistema Backstage.

- A referência da entidade do usuário deve identificar exclusivamente o usuário conectado no Backstage.
- **As referências de propriedade são usadas para determinar o que o usuário possui**, como um conjunto de referências que o usuário reivindica a propriedade. Por exemplo, um usuário Jane ( `user:default/jane`) pode ter as referências de propriedade `user:default/jane`, `group:default/team-a`, e `group:default/admins`. Dadas essas reivindicações de propriedade, qualquer entidade marcada como propriedade de `user:jane`, `team-a`ou `admins`seria considerada de propriedade de Jane.

- Também vale a pena notar que as reivindicações de propriedade também podem ser usadas para resolver outras relações semelhantes à propriedade, como uma reivindicação de um `maintainer`ou `operator`status.

- **O token Backstage** que encapsula a identidade do usuário é um **JWT**. **A referência da entidade do usuário é armazenada na `sub`declaração da carga**, enquanto as referências de propriedade são armazenadas em uma `ent`declaração personalizada. As referências de usuário e propriedade sempre devem ser referências de entidade completas, em vez de abreviações como apenas `jane`ou `user:jane`.

  

## Sign-in Resolvers

- Fazer login de um usuário no Backstage requer um mapeamento da identidade do usuário do provedor de autenticação de terceiros para uma identidade de usuário do Backstage. **Não há uma maneira padrão de resolver identidades de usuários**. O provedor de autenticação que se deseja usar para entrada deve ser configurado com um resolvedor de entrada, que é uma função responsável por criar esse mapeamento de identidade do usuário.

- A entrada para a função do resolvedor de login é o resultado de um login bem-sucedido com o provedor de autenticação fornecido, bem como um objeto de contexto que contém vários auxiliares para pesquisar usuários e emitir tokens.

### Custom Resolver 

Vejamos um exemplo de um resolvedor de login personalizado para o provedor de autenticação do Google. Isso tudo normalmente acontece dentro do seu **packages/backend/src/plugins/auth.ts** 	arquivo, que é responsável por configurar e configurar o plug-in de back-end de autenticação.

Você fornece o resolvedor como parte das opções que você passa ao criar uma nova **auth provider factory**. Isso significa que você precisa substituir o provedor padrão do Google por um que você criou. Certifique-se de incluir também o existente `defaultAuthProviderFactories` se quiser manter todos os provedores de autenticação integrados instalados.

Agora vamos ver o exemplo, com o resto do comentário sendo feito nos comentários do código:

```ts
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,
      google: providers.google.create({
        signIn: {
          resolver: async (info, ctx) => {
            const {
              profile: { email },
            } = info;
            // Profiles are not always guaranteed to to have an email address.
            // You can also find more provider-specific information in `info.result`.
            // It typically contains a `fullProfile` object as well as ID and/or access
            // tokens that you can use for additional lookups.
            if (!email) {
              throw new Error('User profile contained no email');
            }

            // You can add your own custom validation logic here.
            // Logins can be prevented by throwing an error like the one above.
            myEmailValidator(email);

            // This example resolver simply uses the local part of the email as the name.
            const [name] = email.split('@');

            // This helper function handles sign-in by looking up a user in the catalog.
            // The lookup can be done either by reference, annotations, or custom filters.
            //
            // The helper also issues a token for the user, using the standard group
            // membership logic to determine the ownership references of the user.
            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
        },
      }),
    },
  });
}
```



## Resolução de propriedade personalizada

Se você quiser ter mais controle sobre a resolução de associação e geração de token que acontece durante a entrada, você pode substituir `ctx.signInWithCatalogUser`por um conjunto de chamadas de nível inferior:

```ts
import { getDefaultOwnershipRefs } from '@backstage/plugin-auth-backend';

// This example only shows the resolver function itself.
async ({ profile: { email } }, ctx) => {
  if (!email) {
    throw new Error('User profile contained no email');
  }

  // This step calls the catalog to look up a user entity. You could for example
  // replace it with a call to a different external system.
  const { entity } = await ctx.findCatalogUser({
    annotations: {
      'acme.org/email': email,
    },
  });

  // In this step we extract the ownership references from the user entity using
  // the standard logic. It uses a reference to the entity itself, as well as the
  // target of each `memberOf` relation where the target is of the kind `Group`.
  //
  // If you replace the catalog lookup with something does not return
  // an entity you will need to replace this step as well.
  //
  // You might also replace it if you for example want to filter out certain groups.
  const ownershipRefs = getDefaultOwnershipRefs(entity);

  // The last step is to issue the token, where we might provide more options in the future.
  return ctx.issueToken({
    claims: {
      sub: stringifyEntityRef(entity),
      ent: ownershipRefs,
    },
  });
};
```

## AuthHandler

Semelhante a um resolvedor de login personalizado, você também pode escrever uma função de manipulador de autenticação personalizada que é usada para verificar e converter a resposta de autenticação no perfil que será apresentado ao usuário. É aqui que você pode personalizar itens como nome de exibição e foto do perfil.

Este também é o local onde você pode fazer a autorização e validação do usuário e lançar erros se o usuário não tiver permissão de acesso no Backstage.

```tsx
// File: packages/backend/src/plugins/auth.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        authHandler: async ({
          fullProfile  // Type: passport.Profile,
          idToken      // Type: (Optional) string,
        }) => {
          // Custom validation code goes here
          return {
            profile: {
              email,
              picture,
              displayName,
            }
          };
        }
      })
    }
  })
}
```



## OAuth em @backstage/core-app-api e auth-backend

A implementação OAuth padrão no Backstage é baseada em um fluxo de acesso offline do lado do servidor OAuth, o que significa que ele usa o back-end como um auxiliar para trocar credenciais.

## Fluxo OAuth

A seguir, descreve o fluxo OAuth implementado pelo [auth-backend](https://github.com/backstage/backstage/tree/master/plugins/auth-backend) e [DefaultAuthConnector](https://github.com/backstage/backstage/blob/master/packages/core-app-api/src/lib/AuthConnector/DefaultAuthConnector.ts) no `@backstage/core-app-api`.

Componentes e APIs podem solicitar tokens de acesso ou ID de qualquer provedor de autenticação disponível. Se já existir um novo token armazenado em cache que cubra (pelo menos) os escopos solicitados, ele será retornado imediatamente. Se o provedor OAuth implementar atualizações de token, essa verificação também acionará uma tentativa de atualização de token se nenhuma sessão estiver disponível.

![Diagrama de sequência](https://backstage.io/docs/assets/auth/oauth-popup-flow.svg)

<hr>

# 1.3 Classes de back-end de autenticação

## Como funciona a autenticação?

O aplicativo Backstage pode usar vários provedores de autenticação externos para autenticação. Um provedor externo é encapsulado usando uma `AuthProviderRouteHandlers`interface para lidar com a autenticação. Essa interface consiste em quatro métodos. Cada um desses métodos é hospedado em um endpoint (por padrão) `/api/auth/[provider]/method`, onde `method`realiza uma determinada operação da seguinte forma:

```ini
  /auth/[provider]/start -> Initiate a login from the web page
  /auth/[provider]/handler/frame -> Handle a finished authentication operation
  /auth/[provider]/refresh -> Refresh the validity of a login
  /auth/[provider]/logout -> Log out a logged-in user
```

O fluxo é o seguinte:

1. Um usuário tenta entrar.
2. Uma janela pop-up é aberta, apontando para o `auth`terminal. Esse endpoint faz as preparações iniciais e redireciona o usuário para um autenticador externo, ainda dentro do pop-up.
3. O autenticador valida o usuário e retorna o resultado da validação (sucesso OU falha), para o endpoint do wrapper ( `handler/frame`).
4. A `handler/frame`b´webpage renderizada emitirá a resposta apropriada para a página da web que abriu a janela pop-up, e o pop-up será fechado.
5. O usuário sai clicando em uma interface de interface do usuário e a página da Web faz uma solicitação para sair do usuário.

Atualmente, existem duas classes diferentes para dois mecanismos de autenticação que implementam essa interface: uma `OAuthAdapter`para mecanismos baseados em [OAuth](https://oauth.net/2/)`SAMLAuthProvider` e uma para [SAML](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html) .

### Mecanismos OAuth

Atualmente, o OAuth é considerado o mecanismo de autenticação de fato para aplicativos baseados no Backstage.

O Backstage vem com um conjunto "incluído de baterias" de provedores OAuth comumente usados com suporte: Okta, GitHub, Google, GitLab e um provedor OAuth2 genérico. 

**Todos eles usam o fluxo de autorização do OAuth2 para implementar a autenticação.**

Se o seu provedor de autenticação for um dos provedores mencionados acima, você pode configurá-los definindo as variáveis corretas na `app-config.yaml`seção `auth`.

### Configuração

Cada provedor de autenticação (exceto SAML) precisa de seis parâmetros: **um ID do cliente OAuth, um segredo do cliente, um endpoint de autorização, um endpoint de token, uma lista opcional de escopos** (como uma string separada por espaços) que podem ser exigidos pelo servidor OAuth2 para habilitar o logon do usuário final e uma origem de aplicativo. A origem do aplicativo é a **URL** na qual o frontend do aplicativo está hospedado e é lido no `app.baseUrl`arquivo config. Isso é necessário porque o aplicativo abre uma janela pop-up para realizar a autenticação e, uma vez concluído o fluxo, a janela pop-up envia um `postMessage`para o aplicativo front-end para indicar o resultado da operação. Além disso, essa **URL** é usada para verificar se as solicitações de autenticação são provenientes apenas desse endpoint.

Esses valores são configurados por meio do `app-config.yaml`presente na raiz da pasta do seu aplicativo.



### Interfaces de encapsulamento OAuth.

Cada provedor externo OAuth é compatível com uma estratégia correspondente do [Passport . ](https://github.com/jaredhanson/passport)Para um provedor OAuth2 genérico, o passaporte tem uma estratégia`passport-oauth2`. A classe de estratégia lida com os detalhes de implementação do trabalho com cada provedor.

Cada estratégia é envolvida por uma `OAuthHandlers`interface.

Essa interface não pode ser usada diretamente como um manipulador de solicitação HTTP Express. Para isso, `OAuthHandlers`são encapsulados em um `OAuthAdapter`, que implementa a `AuthProviderRouterHandlers`interface.

<hr>



# 1.4 Solução de problemas de autenticação

:arrow_right:  https://backstage.io/docs/auth/troubleshooting



<hr>


