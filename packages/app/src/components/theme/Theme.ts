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
        main: '#2B73D2',
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
        main: '#34548a',
      },
      success: {
        main: '#129900',
      },
      background: {
        default: '#e7e7e7',
        paper: '#ffffffec',
      },
      banner: {
        info: '#111b47',
        error: '#96102b',
        text: '#13182c',
        link: '#104c7e',
      },
      errorBackground: '#96102b',
      warningBackground: '#e0b908',
      infoBackground: '#34548a',
      navigation: {
        background: '#3166ac',
        indicator: '#cdcdcd',
        color: '#d5d6db',
        selectedColor: '#ffffff',
      },
    },
    defaultPageTheme: 'home',
    fontFamily: 'Overpass, sans-serif',
    /* below drives the header colors */
    pageTheme: {
      home: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      documentation: genPageTheme({colors: ['#054496', '#2B73D2'], shape: shapes.wave2}),
      tool: genPageTheme({colors: ['#054496', '#2B73D2'], shape: shapes.round}),
      service: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      website: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      library: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      other: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      app: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      apis: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
    },
  });


  export const Dark = createTheme({
    palette: {
      ...darkTheme.palette,
      primary: {
        main: '#2B73D2',
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
        main: '#FF0000',  
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
        error: '#96102b',
        text: '#13182c',
        link: '#104c7e',
      },
      errorBackground: '#96102b',  
      warningBackground: '#e0b908',
      infoBackground: '#34548a',
      navigation: {
        background: '#1d1d1d',  
        indicator: '#4068BB',
        color: '#ffffffb3',
        selectedColor: '#4068BB',
      },
    },
    defaultPageTheme: 'home',
    fontFamily: 'Overpass, sans-serif',
    /* below drives the header colors */
    pageTheme: {
      home: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      documentation: genPageTheme({colors: ['#054496', '#2B73D2'], shape: shapes.wave2}),
      tool: genPageTheme({colors: ['#054496', '#2B73D2'], shape: shapes.round}),
      service: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      website: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      library: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      other: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      app: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
      apis: genPageTheme({colors:['#054496', '#2B73D2'], shape: shapes.wave}),
    },
  });

