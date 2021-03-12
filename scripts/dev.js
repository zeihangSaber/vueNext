const fs = require('fs')
// 用来开启子进程
const execa = require('execa')

async function build(target) {
  await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
    // 将打包信息共享给父进程
    stdio: 'inherit',
  })
}

const target = 'runtime-dom'

build(target)
