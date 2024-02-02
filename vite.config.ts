import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // 自定义构建输出目录
    target: 'esnext',
    // 排除掉不需要打包的文件
    rollupOptions: {
      external: ['vue'],
    },
    lib: {
      entry: 'src/main.ts', // 入口文件路径
      formats: ['es', 'cjs'],
    },
  },
  server: {
    port: 8080, // 自定义开发服务器端口
  },
});
// function defineConfig(arg0: {
//   build: {
//     outDir: string; // 自定义构建输出目录
//     target: string;
//     lib: {
//       entry: string; // 入口文件路径
//       formats: string[];
//     };
//   };
//   server: { port: number };
// }) {
//   throw new Error('Function not implemented.');
// }
