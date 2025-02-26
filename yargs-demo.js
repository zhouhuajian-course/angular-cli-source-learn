const yargs = require('yargs')  // 

// const argv = yargs.parse()
// console.log(process.argv);
// console.log(argv);

yargs
  .command({
    command: 'add',
    describe: '添加笔记',
    handler: function () {
      console.log('正在添加笔记……');
    }
  })
  .command({
    command: 'edit <file>',
    describe: '编辑笔记',
    handler: function (argv) {
      console.log('正在编辑笔记…… ' + argv.file);
    }
  })
  .scriptName('note')
  .epilogue('欢迎使用笔记命令行工具。')
  .parse()


