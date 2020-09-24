/**
 * 项目nginx和上传配置
 */
module.exports = {
  username: '',
  password: '',
  host: '127.0.0.1',
  dataPath: {
    development: '/home/aucd/vcode/dev',
    staging: '/home/aucd/vcode/stage',
    stable: '/home/aucd/vcode/stable'
  },
  confPath: '/dist',
  confName: 'test',
  serverName: {
    development: 'vcode-dev.vmic.xyz',
    staging: 'vcode-test.vmic.xyz',
    stable: 'vcode-stable.vmic.xyz'
  },
  api: {
    development: 'http://10.101.20.79:8080',
    staging: 'http://10.101.18.192:8080',
    stable: 'http://10.101.102.203:8080',
  }
}