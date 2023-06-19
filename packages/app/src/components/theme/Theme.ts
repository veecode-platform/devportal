import {
  createTheme,
  darkTheme,
  genPageTheme,
  lightTheme,
  shapes,
} from '@backstage/theme';

export const Light = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: '#202020',
    },
    secondary: {
      main: '#353b55',
    },
    error: {
      main: '#b41b39',
    },
    warning: {
      main: '#e0b908',
    },
    info: {
      main: '#33FFCE',
    },
    success: {
      main: '#129900',
    },
    background: {
      default: '#e7e7e7',
      paper: '#ffffff',  
    },
    banner: {
      info: '#111b47',
      error: '#ffaea5',  
      text: '#13182c',
      link: '#104c7e',
    },
    errorBackground: '#ffaea5',
    warningBackground: '#e0b908',
    infoBackground: '#34548a',
    navigation: {
      background: '#000000', 
      indicator: '#33FFCE',
      color: '#cdcdcd',
      selectedColor: '#33FFCE',
    },
  },
  defaultPageTheme: 'home',
  fontFamily: 'Overpass, sans-serif',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    documentation: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    tool: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    service: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    website: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    library: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    other: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    app: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    apis: genPageTheme({ colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
  }
});


export const Dark = createTheme({
  palette: {
    ...darkTheme.palette,
    primary: {
      main: '#ffffffb3',
    },
    secondary: {
      main: '#ffffffb3',
    },
    error: {
      main: '#FF0000', 
    },
    warning: {
      main: '#e0b908',  
    },
    info: {
      main: '#33FFCE',  
    },
    success: {
      main: '#129900',  
    },
    background: {
      default: '#1d1d1d',
      paper: '#2c2c2c',
    },
    banner: {       
      info: '#111b47',
      error: '#ffaea5',
      text: '#13182c',
      link: '#104c7e',
    },
    errorBackground: '#ffaea5',    
    warningBackground: '#e0b908',
    infoBackground: '#34548a',
    navigation: {
      background: '#1d1d1d',  
      indicator: '#33FFCE',
      color: '#33FFCE',  
      selectedColor: '#ffffffb3',
    },
  },
  defaultPageTheme: 'home',
  fontFamily: 'Overpass, sans-serif',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    documentation: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    tool: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2 }),
    service: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    website: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    library: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    other: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    app: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
    apis: genPageTheme({colors: ['#52a88c', '#23c28e'], shape: shapes.wave2}),
  }
});
