import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const extensions = ['.js', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/bundles/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.umd.js',
      format: 'umd',
      name: 'react-router-animator',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.umd.min.js',
      format: 'umd',
      name: 'react-router-animator',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  external: ['react', 'react-dom', 'react-router-dom', 'react-transition-group'],
  // globals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  //   'react-router-rom': 'ReactRouterDOM',
  //   'react-transition-group': 'ReactTransitionGroup'
  // },
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.tsx'],
      extensions,
      exclude: './node_modules/**'
    })
  ]
};
