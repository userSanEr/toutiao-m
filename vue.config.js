module.exports = {
  lintOnSave: false,
  devServer: {
    port: 9020, // 端口
    open: true, // 启动后打开浏览器
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    }
  }
}
