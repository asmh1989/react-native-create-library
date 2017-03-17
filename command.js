const emoji = require('node-emoji');
const fs = require("fs");

const createLibrary = require('./lib');

module.exports = {
  name: 'create-library',
  description: 'creates a React Native library for different platforms',
  usage: '[options] <name>',
  func: (args, config, options) => {
    let name = args[0];
    const prefix = options.prefix;
    const modulePrefix = options.modulePrefix;
    const packageIdentifier = options.packageIdentifier;
    const namespace = options.namespace;
    let platforms = (options.platforms) ? options.platforms.split(',') : options.platforms;
    const overridePrefix = options.overridePrefix;
    const configFile = options.config;

    const beforeCreation = Date.now();

    let __methods;
    let __views;

    let __config = null;

    if(configFile.length > 0){
      {
        try {
          let data = fs.readFileSync(configFile);
          __config = JSON.parse(data.toString());
        } catch (e){
          throw new Error('Config File content error, it should be a json string');
        }

        const {
          type = 0,
          platform = [],
          module= '',
          methods = [],
          views=[]
        } = __config;

        if(platform.length == 0){
          throw new Error('platform need data');
        }

        if(module.length == 0){
          throw new Error('please set module param');
        }

        platforms = platform;

        if(type == 0){   //组件

          if(methods.length == 0){
            throw new Error('Please specify at least one method to generate the library.');
          }

          __methods = methods

        } else if(type == 1){ //控件
          if(views.length == 0){
            throw new Error('Please specify at least one view to generate the library.');
          }

          __views = views;
        }

        name = module;
      }
    }

    createLibrary({
      name,
      prefix,
      modulePrefix,
      packageIdentifier,
      platforms,
      namespace,
      overridePrefix,
      config: __config
    }).then(() => {
      console.log(`
${emoji.get('books')}  Created library ${name} in \`./${name}\`.
${emoji.get('clock9')}  It took ${Date.now() - beforeCreation}ms.
${emoji.get('arrow_right')}  To get started type \`cd ./${name}\``);
    }).catch((err) => {
      console.error(`Error while creating library ${name}`);

      if (err.stack) {
        console.error(err.stack);
      }
    });
  },
  options: [{
    command: '--prefix <prefix>',
    description: 'The prefix for the library (Default: `RN`)',
    default: 'RN',
  }, {
    command: '--override-prefix',
    description: 'Overrides the prefix check and allows the name to begin with uppercase characters',
  }, {
    command: '--module-prefix <modulePrefix>',
    description: 'The module prefix for the library (Default: `react-native`)',
    default: 'react-native',
  }, {
    command: '--package-identifier <packageIdentifier>',
    description: '(Android only!) The package name for the Android module (Default: `com.reactlibrary`)',
    default: 'com.reactlibrary',
  }, {
    command: '--namespace <namespace>',
    description: '(Windows only!) The namespace for the Windows module\n' +
    ' (Default: The package identifier as PascalCase, which is `Com.Reactlibrary`)',
    default: 'Com.Reactlibrary',
  }, {
    command: '--platforms <platforms>',
    description: 'Platforms the library will be created for. (comma separated; default: `ios,android,windows`)',
    default: 'ios,android,windows',
  }, {
    command: '--config <config>',
    description: 'config file',
    default: '',
  }]
};
