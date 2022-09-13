import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs'],
  target: 'es2020',
  bundle: true,
});
