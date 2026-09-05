import * as Babel from '@babel/standalone';

export function compileCode(code) {
  return Babel.transform(code, {
    presets: [
      ['react', { runtime: 'classic' }],
      ['env', { modules: 'commonjs' }]
    ],
    filename: 'app.js'
  }).code;
}
