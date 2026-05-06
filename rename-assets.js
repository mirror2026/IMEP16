#!/usr/bin/env node
/**
 * 批量将 public 下的中文/复杂文件名改为英文资源名，避免部分服务器对 URL 编码处理不一致。
 *
 * 用法：
 *   node rename-assets.js           # 默认 dry-run，只打印计划不重命名
 *   node rename-assets.js --apply   # 真正执行重命名，并写入 rename-assets-log.json
 *
 * 规则优先级（自上而下）：
 *   1) 「研bot」且「公众号」→ partner-yanbot-wechat.<原扩展名>
 *   2) 「奇迹飞鸟」或「头像」→ avatar-creator.<原扩展名>
 *   3) public 根目录 icon_副本 / logo_副本 → icon-copy / logo-copy
 *   4) IMEP16：文件名以四位大写字母- 开头 → result-<小写>.<扩展名>
 *   5) Q20：SCENE_BY_BASENAME 映射 → scene-q{n}.<扩展名>
 *   6) 任意目录「第N题」→ scene-qN.<扩展名>
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, 'public')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

/** 与 src/App.tsx 中 questionImageMap 顺序一致（basename → 目标文件名含扩展名） */
const SCENE_BY_BASENAME = {
  '心动场景-1776864035563.png': 'scene-q1.png',
  '宿舍求生-1776864049480.png': 'scene-q2.png',
  '吃瓜法则-1776864061295.png': 'scene-q3.png',
  '报错场景-1776864068525.png': 'scene-q4.png',
  '选课博弈-1776864074381.png': 'scene-q5.png',
  '海王陷阱-1776864088261.png': 'scene-q6.png',
  '破产危机-1776864097591.png': 'scene-q7.png',
  '违纪边缘-1776864103549.png': 'scene-q8.png',
  'Offer抉择-1776864112983.png': 'scene-q9.png',
  '研Bot预警-1776864118432.png': 'scene-q10.png',
  '深夜茶话会-1776864128460.png': 'scene-q11.png',
  '社团遁术-1776864140691.png': 'scene-q12.png',
  '厕所搭子-1776864148427.png': 'scene-q13.png',
  '饭点落单-1776864157611.png': 'scene-q14.png',
  '小组作业-1776864166140.png': 'scene-q15.png',
  '灵异物理学-1776864174956.png': 'scene-q16.png',
  '兵荒马乱-1776864185496.png': 'scene-q17.png',
  '玄学解压-1776864194042.png': 'scene-q18.png',
  '立Flag-1776864201639.png': 'scene-q19.png',
  'DDL玄学-1776864206860.png': 'scene-q20.png',
}

const apply = process.argv.includes('--apply')
const log = []

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name)
    if (name.isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

function targetForFile(fullPath) {
  const basename = path.basename(fullPath)
  const ext = path.extname(basename).toLowerCase()
  if (!IMAGE_EXT.has(ext)) return null

  const relFromPublic = path.relative(ROOT, fullPath).split(path.sep).join('/')
  const dirName = path.basename(path.dirname(fullPath))

  // 0) public 根目录含中文副本后缀的图标（部署 URL 友好）
  if (relFromPublic === 'icon_副本.png') return 'icon-copy.png'
  if (relFromPublic === 'logo_副本.png') return 'logo-copy.png'

  // 1) 研 Bot 公众号二维码（勿匹配「研Bot预警」等题库图）
  if (
    basename.includes('公众号') &&
    (basename.includes('研bot') || basename.includes('研Bot'))
  ) {
    return `partner-yanbot-wechat${ext}`
  }

  // 2) 创作者头像
  if (basename.includes('奇迹飞鸟') || basename.includes('头像')) {
    return `avatar-creator${ext}`
  }

  // 3) IMEP16 性格结果图：前缀四位大写字母
  if (dirName === 'IMEP16') {
    const m = basename.match(/^([A-Z]{4})-/u)
    if (m) {
      const code = m[1].toLowerCase()
      return `result-${code}${ext}`
    }
  }

  // 4) Q20：固定映射
  if (dirName === 'Q20' && SCENE_BY_BASENAME[basename]) {
    return SCENE_BY_BASENAME[basename]
  }

  // 5) 「第N题」
  const ti = basename.match(/第(\d+)题/)
  if (ti) {
    return `scene-q${ti[1]}${ext}`
  }

  return null
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('未找到 public 目录:', ROOT)
    process.exit(1)
  }

  const all = walk(ROOT)
  let planned = 0

  for (const fullPath of all) {
    const newBasename = targetForFile(fullPath)
    if (!newBasename) continue

    const dir = path.dirname(fullPath)
    const dest = path.join(dir, newBasename)
    const oldRel = path.relative(__dirname, fullPath).split(path.sep).join('/')
    const newRel = path.relative(__dirname, dest).split(path.sep).join('/')

    if (path.basename(fullPath) === newBasename) continue

    if (fs.existsSync(dest) && path.resolve(fullPath) !== path.resolve(dest)) {
      console.warn('[跳过] 目标已存在:', newRel)
      log.push({ action: 'skip_exists', from: oldRel, to: newRel })
      continue
    }

    planned++
    console.log(`${apply ? '✓' : '·'} ${oldRel}  →  ${newRel}`)
    log.push({ action: apply ? 'renamed' : 'would_rename', from: oldRel, to: newRel })

    if (apply) fs.renameSync(fullPath, dest)
  }

  if (!apply) {
    console.log('\n以上为预览（dry-run）。确认无误后执行：')
    console.log('  node rename-assets.js --apply\n')
  } else {
    const logPath = path.join(__dirname, 'rename-assets-log.json')
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), 'utf8')
    console.log('\n已写入日志:', path.relative(__dirname, logPath))
  }

  console.log(apply ? `完成，共重命名 ${planned} 个文件。` : `预览结束，计划重命名 ${planned} 个文件。`)
}

main()
