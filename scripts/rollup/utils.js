import path from 'path'
import fs from 'fs'

import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'

const pkgPath = path.resolve(__dirname, '../../packages')
const distPath = path.resolve(__dirname, '../../dist/node_modules')

export function resolvePkgPath(pkgName, isDist) {
  return isDist ? `${distPath}/${pkgName}` : `${pkgPath}/${pkgName}`
}

export function getPackageJson(pkgName) {
  const path = `${resolvePkgPath(pkgName)}/package.json`
  const content = fs.readFileSync(path, 'utf-8')
  return JSON.parse(content)
}

export function getBaseRollupPlugins ({
  typescript
} = {}) {
  return [cjs(), ts(typescript)]
}
