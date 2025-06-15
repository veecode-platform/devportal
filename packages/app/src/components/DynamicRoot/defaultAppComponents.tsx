import { AppComponents } from '@backstage/core-plugin-api';

import { NotFoundErrorPage } from '../ErrorPages/NotFoundErrorPage';
import { VeeCodeSignInPage } from '../VeeCodeSignInPage';

const defaultAppComponents: Partial<AppComponents> = {
  SignInPage: props => <VeeCodeSignInPage {...props} />,
  NotFoundErrorPage: props => <NotFoundErrorPage {...props} />,
};

export default defaultAppComponents;
