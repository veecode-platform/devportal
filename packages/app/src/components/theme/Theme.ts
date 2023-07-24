import {
  genPageTheme,
  shapes,
  createUnifiedTheme,
} from '@backstage/theme';

const devportalPalletes = {
  light: {
    type: 'light' as const,
    mode: 'light' as const,
    background: {
      default: '#e7e7e7',
      paper: '#ffffff',  
    },
    status: {
      ok: '#129900',
      warning: '#e0b908',
      error: '#b41b39',
      running: '#1F5493',
      pending: '#FFED51',
      aborted: '#757575',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
      },
    },
    primary: {
      main: '#202020',
    },
    banner: {
      info: '#111b47',
      error: '#ffaea5',
      text: '#13182c',
      link: '#104c7e',
      closeButtonColor: '#FFFFFF',
      warning: '#FF9800',
    },
    border: '#E6E6E6',
    textContrast: '#000000',
    textVerySubtle: '#DDD',
    textSubtle: '#6E6E6E',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#2196F3',
    link: '#0A6EBE',
    gold: '#FFD600',
    navigation: {
      background: '#171717',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#404040',
      },
      submenu: {
        background: '#404040',
      },
    },
    pinSidebarButton: {
      icon: '#181818',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
  dark: {
    type: 'dark' as const,
    mode: 'dark' as const,
    background: {
      default: '#1d1d1d',
      paper: '#2c2c2c',
    },
    status: {
      ok: '#129900',
      warning: '#e0b908',
      error: '#FF0000',
      running: '#3488E3',
      pending: '#FEF071',
      aborted: '#9E9E9E',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
      },
    },
    primary: {
      main: '#ffffffb3',
      dark: '#82BAFD',
    },
    secondary: {
      main: '#ffffffb3',
    },
    banner: {
      info: '#111b47',
      error: '#ffaea5',
      text: '#13182c',
      link: '#104c7e',
      closeButtonColor: '#FFFFFF',
      warning: '#FF9800',
    },
    border: '#E6E6E6',
    textContrast: '#FFFFFF',
    textVerySubtle: '#727272',
    textSubtle: '#CCCCCC',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#82BAFD',
    link: '#9CC9FF',
    gold: '#FFD600',
    navigation: {
      background: '#424242',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
      navItem: {
        hoverBackground: '#404040',
      },
      submenu: {
        background: '#404040',
      },
    },
    pinSidebarButton: {
      icon: '#404040',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
};

const devportalPageThemes = {
  light: {
    home: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
    documentation: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave}),
    tool: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    service: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
    website: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave}),
    library: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    other: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
    app: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave}),
    apis: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    card: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
  },
  dark: {
    home: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
    documentation: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave}),
    tool: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    service: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
    website: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave}),
    library: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    other: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
    app: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave}),
    apis: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    card: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round}),
  }
}

export const devportalThemes = {
  light: createUnifiedTheme({palette: devportalPalletes.light, pageTheme: devportalPageThemes.light}),
  dark: createUnifiedTheme({palette: devportalPalletes.dark, pageTheme: devportalPageThemes.dark})
}

