/*
  yarn add gulp gulp-ssh
 */
const gulp = require('gulp');
const GulpSSH = require('gulp-ssh');
const sshConfig = require('./config/index');
const fs = require('fs');

const env = process.env.NODE_ENV;
const { dataPath, host, username, password, serverName, confName, confPath, api } = sshConfig;
// 需要上传到服务器的路径
const remotePath = dataPath[env];
// nginx配置的服务端请求地址
const serverApi = api[env];

// 生成的nginx配置名称
const nginxConfName = `${confName}-${env}.conf`;
// 配置nignx的serve_name
const ngingServeName = serverName[env];

const config = {
  ssh: { // 正式
    host,
    port: 8001,
    username,
    password
  },
  remotePath,
  commands: [
    // 删除现有文件
    `rm -rf ${remotePath}`
  ],
  cat: [
    `cat ${confPath}/${nginxConfName}`
  ]
};

const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config.ssh
});

console.log(gulpSSH)

// 上传前先删除服务器上现有文件...
gulp.task('execSSH', done => {
  console.log(`上传文件到${env}环境...`);
  console.log('删除服务器上现有文件...');
  gulpSSH.shell(config.commands, { filePath: 'commands.log' })
    .pipe(gulp.dest('logs'));
  done();
});

gulp.task('deploy', gulp.series('execSSH', done => {
  // 上传文件到服务器
  console.log('2s后开始上传文件到服务器...');
  setTimeout(() => {
    gulp.src(['./dist/**/*.js'])
      .pipe(gulpSSH.dest(config.remotePath));
    done();
  }, 2000);
}));

// 生成nginx配置文件
gulp.task('generate', done => {
  let confStr = fs.readFileSync('./config/nginx.conf', 'utf8');
  confStr = confStr.replace(/\$\{serverName\}/g, ngingServeName);
  confStr = confStr.replace(/\$\{dataPath\}/g, remotePath);
  confStr = confStr.replace(/\$\{api\}/g, serverApi);
  fs.writeFileSync(nginxConfName, confStr);
  done();
});

// 上传nginx配置文件
gulp.task('pushconf', gulp.series('generate', done => {
  gulp.src([`./${nginxConfName}`]).pipe(gulpSSH.dest(confPath));
  console.log('1s后自动执行nginx配置生效命令');
  setTimeout(() => {
    gulpSSH.shell('sudo nginx -s reload', { filePath: 'commands.log' })
      .pipe(gulp.dest('logs'));
    done();
  }, 1000);
}));

gulp.task('nginx', gulp.parallel('pushconf', done => {
  // 上传完之后删除本地生成的配置文件
  console.log('1s后删除本地配置文件...');
  setTimeout(() => {
    fs.unlinkSync(`./${nginxConfName}`)
    done();
  }, 1000);
}));

/**
 * 查看服务器ng配置
 */
gulp.task('cat', done => {
  console.log(`查看${env}服务器ng配置...`);
  gulpSSH.shell(config.cat).on('ssh2Data', (data) => {
    process.stdout.write(data.toString());
  });
  done();
});

gulp.task('default', gulp.parallel('deploy', done => {
  // 将你的默认的任务代码放在这
  done();
}));