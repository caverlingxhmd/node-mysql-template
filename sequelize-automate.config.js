/*
  参考文章
  https://juejin.im/post/6844904042150232077#heading-1
*/

const Automate = require('sequelize-automate');
const fs = require("fs")
const path = require("path")
const config = require("config-lite")

const dbOptions = {
  ...config.dbOptions,
  define: {
    // underscored: false,
    // freezeTableName: false,
    charset: 'utf8_bin',
    // timezone: '+00:00',
    // dialectOptions: {
    //   collate: 'utf8_general_ci',
    // },
    // timestamps: false,
  },
}

const options = {
  type: 'js', // 指定 models 代码风格
  camelCase: false, // Models 文件中代码是否使用驼峰发命名
  fileNameCamelCase: false, // Model 文件名是否使用驼峰法命名，默认文件名会使用表名，如 `user_post.js`；如果为 true，则文件名为 `userPost.js`
  dir: './db/models', // 指定输出 models 文件的目录
  // typesDir: 'models', // 指定输出 TypeScript 类型定义的文件目录，只有 TypeScript / Midway 等会有类型定义
  emptyDir: false, // 生成 models 之前是否清空 `dir` 以及 `typesDir`
  tables: ["project_info"], // 指定生成哪些表的 models，如 ['user', 'user_post']；如果为 null，则忽略改属性
  skipTables: null, // 指定跳过哪些表的 models，如 ['user']；如果为 null，则忽略改属性
  tsNoCheck: false, // 是否添加 `@ts-nocheck` 注释到 models 文件中
}

// 创建一个 automate 实例
const automate = new Automate(dbOptions, options);

(async function main() {
  // // 获取 Models JSON 定义
  // const definitions = await automate.getDefinitions();
  // console.log(definitions);

  // 或生成代码
  const code = await automate.run();

  // 匹配该字符窜 '  const options = {'
  let reg = /^\s*const\s*options/;

  // 参考地址  https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/core-concepts/model-basics.md
  // 为每个model添加这行参数 不自动添加 createAt updateAt两个参数
  const add = ['    timestamps: false,'];

  (function iterable(i) {
    if (i === code.length) return
    let { file, code: codeString } = code[i]

    let codeArr = codeString.split("\n")
    let index = codeArr.findIndex(str => reg.test(str))
    i++
    if (index > 0) {
      codeArr.splice(index + 1, 0, ...add)
      const url = path.join(__dirname, "./db/models/", file)
      fs.readFile(url, function(err, data) {
        // 文件读取不出来 进行下一个读取
        if (err) {
          return iterable(i)
        }
        // 重新写入文件
        fs.writeFile(url, codeArr.join("\n"), function(err) {
          iterable(i)
        })
      })
    } else {
      iterable(i)
    }
  })(0)
})()