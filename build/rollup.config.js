import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'iife',
  plugins: [
    resolve({
      main: true
    }),
    babel({
      sourceMap: true,
      exclude: 'node_modules/**'
    })
  ],
  dest: 'dist/o2_base.js'
};