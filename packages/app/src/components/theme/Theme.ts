import {
  genPageTheme,
  shapes,
  createUnifiedTheme,
} from '@backstage/theme';

export interface ThemeJson {
  background?: {
    default?: string,
    paper?: string,
  },
  status?: {
    ok?: string,
    warning?: string,
    error?: string,
    running?: string,
    pending?: string,
    aborted?: string,
  },
  bursts?: {
    fontColor?: string,
    slackChannelText?: string,
    backgroundColor?: {
      default?: string,
    },
    gradient?: {
      linear?: string,
    },
  },
  primary?: {
    main?: string,
  },
  banner?: {
    info?: string,
    error?: string,
    text?: string,
    link?: string,
    closeButtonColor?: string,
    warning?: string,
  },
  border?: string,
  textContrast?: string,
  textVerySubtle?: string,
  textSubtle?: string,
  highlight?: string,
  errorBackground?: string,
  warningBackground?: string,
  infoBackground?: string,
  errorText?: string,
  infoText?: string,
  warningText?: string,
  linkHover?: string,
  link?: string,
  gold?: string,
  navigation?: {
    background?: string,
    indicator?: string,
    color?: string,
    selectedColor?: string,
    navItem?: {
      hoverBackground?: string,
    },
    submenu?: {
      background?: string,
    },
  },
  pinSidebarButton?: {
    icon?: string,
    background?: string,
  },
  tabbar?: {
    indicator?: string,
  },
  pageThemes?: {
    primary?: string,
    secondary?: string
  }

}

export const makeLightTheme = (themeJson?: ThemeJson) => {
  const pageThemesColors = [themeJson?.pageThemes?.primary ?? '#52a88c', themeJson?.pageThemes?.secondary ?? "#23c28e"]
  const lightTheme = {
    pallete: {
      type: 'light' as const,
      mode: 'light' as const,
      background: {
        default: themeJson?.background?.default ?? '#e7e7e7',
        paper: themeJson?.background?.paper ?? '#ffffff',
      },
      status: {
        ok: themeJson?.status?.ok ?? '#129900',
        warning: themeJson?.status?.warning ?? '#e0b908',
        error: themeJson?.status?.error ?? '#b41b39',
        running: themeJson?.status?.running ?? '#1F5493',
        pending: themeJson?.status?.pending ?? '#FFED51',
        aborted: themeJson?.status?.aborted ?? '#757575',
      },
      bursts: {
        fontColor: themeJson?.bursts?.fontColor ?? '#FEFEFE',
        slackChannelText: themeJson?.bursts?.slackChannelText ?? '#ddd',
        backgroundColor: {
          default: themeJson?.bursts?.backgroundColor?.default ?? '#7C3699',
        },
        gradient: {
          linear: themeJson?.bursts?.gradient?.linear ?? 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
        },
      },
      primary: {
        main: themeJson?.primary?.main ?? '#202020',
      },
      banner: {
        info: themeJson?.banner?.info ?? '#111b47',
        error: themeJson?.banner?.error ?? '#ffaea5',
        text: themeJson?.banner?.text ?? '#13182c',
        link: themeJson?.banner?.link ?? '#104c7e',
        closeButtonColor: themeJson?.banner?.closeButtonColor ?? '#FFFFFF',
        warning: themeJson?.banner?.warning ?? '#FF9800',
      },
      border: themeJson?.border ?? '#E6E6E6',
      textContrast: themeJson?.textContrast ?? '#000000',
      textVerySubtle: themeJson?.textVerySubtle ?? '#DDD',
      textSubtle: themeJson?.textSubtle ?? '#6E6E6E',
      highlight: themeJson?.highlight ?? '#FFFBCC',
      errorBackground: themeJson?.errorBackground ?? '#FFEBEE',
      warningBackground: themeJson?.warningBackground ?? '#F59B23',
      infoBackground: themeJson?.infoBackground ?? '#ebf5ff',
      errorText: themeJson?.errorText ?? '#CA001B',
      infoText: themeJson?.infoText ?? '#004e8a',
      warningText: themeJson?.warningText ?? '#000000',
      linkHover: themeJson?.linkHover ?? '#2196F3',
      link: themeJson?.link ?? '#0A6EBE',
      gold: themeJson?.gold ?? '#FFD600',
      navigation: {
        background: themeJson?.navigation?.background ?? '#171717',
        indicator: themeJson?.navigation?.indicator ?? '#9BF0E1',
        color: themeJson?.navigation?.color ?? '#b5b5b5',
        selectedColor: themeJson?.navigation?.selectedColor ?? '#FFF',
        navItem: {
          hoverBackground: themeJson?.navigation?.navItem?.hoverBackground ?? '#404040',
        },
        submenu: {
          background: themeJson?.navigation?.submenu?.background ?? '#404040',
        },
      },
      pinSidebarButton: {
        icon: themeJson?.pinSidebarButton?.icon ?? '#181818',
        background: themeJson?.pinSidebarButton?.background ?? '#BDBDBD',
      },
      tabbar: {
        indicator: themeJson?.tabbar?.indicator ?? '#9BF0E1',
      }
    },
    pageThemes: {
      home: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
      documentation: genPageTheme({ colors: pageThemesColors, shape: shapes.wave }),
      tool: genPageTheme({ colors: pageThemesColors, shape: shapes.wave2 }),
      service: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
      website: genPageTheme({ colors: pageThemesColors, shape: shapes.wave }),
      library: genPageTheme({ colors: pageThemesColors, shape: shapes.wave2 }),
      other: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
      app: genPageTheme({ colors: pageThemesColors, shape: shapes.wave }),
      apis: genPageTheme({ colors: pageThemesColors, shape: shapes.wave2 }),
      card: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
    }
  }
  return createUnifiedTheme({ palette: lightTheme.pallete, pageTheme: lightTheme.pageThemes })
}

export const makeDarkTheme = (themeJson?: ThemeJson) => {
  const pageThemesColors = [themeJson?.pageThemes?.primary ?? '#52a88c', themeJson?.pageThemes?.secondary ?? "#23c28e"]
  const darkTheme = {
    pallete: {
      type: 'dark' as const,
      mode: 'dark' as const,
      background: {
        default: themeJson?.background?.default ?? '#1d1d1d',
        paper: themeJson?.background?.paper ?? '#2c2c2c',
      },
      status: {
        ok: themeJson?.status?.ok ?? '#129900',
        warning: themeJson?.status?.warning ?? '#e0b908',
        error: themeJson?.status?.error ?? '#FF0000',
        running: themeJson?.status?.running ?? '#3488E3',
        pending: themeJson?.status?.pending ?? '#FEF071',
        aborted: themeJson?.status?.aborted ?? '#9E9E9E',
      },
      bursts: {
        fontColor: themeJson?.bursts?.fontColor ?? '#FEFEFE',
        slackChannelText: themeJson?.bursts?.slackChannelText ?? '#ddd',
        backgroundColor: {
          default: themeJson?.bursts?.backgroundColor?.default ?? '#7C3699',
        },
        gradient: {
          linear: themeJson?.bursts?.gradient?.linear ?? 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)',
        },
      },
      primary: {
        main: themeJson?.primary?.main ?? '#ffffffb3',
        dark: '#82BAFD',
      },
      secondary: {
        main: '#ffffffb3',
      },
      banner: {
        info: themeJson?.banner?.info ?? '#111b47',
        error: themeJson?.banner?.error ?? '#ffaea5',
        text: themeJson?.banner?.text ?? '#13182c',
        link: themeJson?.banner?.link ?? '#104c7e',
        closeButtonColor: themeJson?.banner?.closeButtonColor ?? '#FFFFFF',
        warning: themeJson?.banner?.warning ?? '#FF9800',
      },
      border: themeJson?.border ?? '#E6E6E6',
      textContrast: themeJson?.textContrast ?? '#FFFFFF',
      textVerySubtle: themeJson?.textVerySubtle ?? '#727272',
      textSubtle: themeJson?.textSubtle ?? '#CCCCCC',
      highlight: themeJson?.highlight ?? '#FFFBCC',
      errorBackground: themeJson?.errorBackground ?? '#FFEBEE',
      warningBackground: themeJson?.warningBackground ?? '#F59B23',
      infoBackground: themeJson?.infoBackground ?? '#ebf5ff',
      errorText: themeJson?.errorText ?? '#CA001B',
      infoText: themeJson?.infoText ?? '#004e8a',
      warningText: themeJson?.warningText ?? '#000000',
      linkHover: themeJson?.linkHover ?? '#82BAFD',
      link: themeJson?.link ?? '#9CC9FF',
      gold: themeJson?.gold ?? '#FFD600',
      navigation: {
        background: themeJson?.navigation?.background ?? '#424242',
        indicator: themeJson?.navigation?.indicator ?? '#9BF0E1',
        color: themeJson?.navigation?.color ?? '#b5b5b5',
        selectedColor: themeJson?.navigation?.selectedColor ?? '#FFF',
        navItem: {
          hoverBackground: themeJson?.navigation?.navItem?.hoverBackground ?? '#404040',
        },
        submenu: {
          background: themeJson?.navigation?.submenu?.background ?? '#404040',
        },
      },
      pinSidebarButton: {
        icon: themeJson?.pinSidebarButton?.icon ?? '#404040',
        background: themeJson?.pinSidebarButton?.background ?? '#BDBDBD',
      },
      tabbar: {
        indicator: themeJson?.tabbar?.indicator ?? '#9BF0E1',
      }
    },
    pageThemes: {
      home: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
      documentation: genPageTheme({ colors: pageThemesColors, shape: shapes.wave }),
      tool: genPageTheme({ colors: pageThemesColors, shape: shapes.wave2 }),
      service: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
      website: genPageTheme({ colors: pageThemesColors, shape: shapes.wave }),
      library: genPageTheme({ colors: pageThemesColors, shape: shapes.wave2 }),
      other: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
      app: genPageTheme({ colors: pageThemesColors, shape: shapes.wave }),
      apis: genPageTheme({ colors: pageThemesColors, shape: shapes.wave2 }),
      card: genPageTheme({ colors: pageThemesColors, shape: shapes.round }),
    }
  }
  return createUnifiedTheme({ palette: darkTheme.pallete, pageTheme: darkTheme.pageThemes })
}

/*
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
    home: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
    documentation: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave }),
    tool: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    service: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
    website: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave }),
    library: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    other: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
    app: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave }),
    apis: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    card: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
  },
  dark: {
    home: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
    documentation: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave }),
    tool: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    service: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
    website: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave }),
    library: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    other: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
    app: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave }),
    apis: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    card: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.round }),
  }
}

export const devportalThemes = {
  light: createUnifiedTheme({ palette: devportalPalletes.light, pageTheme: devportalPageThemes.light }),
  dark: createUnifiedTheme({ palette: devportalPalletes.dark, pageTheme: devportalPageThemes.dark })
}
*/
