const fs = require('fs')
// 用来开启子进程
const execa = require('execa')

const targets = fs.readdirSync('packages').filter(f => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) return false
  return true
})

async function build(target) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
    // 将打包信息共享给父进程
    stdio: 'inherit',
  })
}

function runParallel(targets, iteratorFn) {
  const res = []
  for (const item of targets) {
    const p = iteratorFn(item)
    res.push(p)
  }
  return Promise.all(res)
}

runParallel(targets, build).then(() => {
  console.log('打包完成')
})
