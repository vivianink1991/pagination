import babel from 'rollup-plugin-babel';

export default {
  entry: 'jsnext/core.js',
  dest: 'build/pagination.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    })
  ],
  format: 'umd'
};