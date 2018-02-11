# webpack 使用记录
webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。
当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
## 基本安装
1. 局部安装,官方也是推荐安装到项目目录下

```
mkdir webpack-demo-1
cd webpack-demo-1
npm init -y //生成package.json,并且一路同意,如果没啥个性化的内容则省了你一路狂按enter
npm install --save-dev webpack //安装到开发环境里面(devDependicies)
```
2. webpack基本配置文件
```
touch webpack.config.js
vi webpack.config.js
```
配置文件内容如下
```
const path = require('path');

module.exports = {
  entry: './src/index.js', // 这里应用程序开始执行,webpack 开始打包
  output: {
    // webpack 如何输出结果的相关选项
    filename: 'bundle.js',//输出资源块的名字(asset chunk)
    path: path.resolve(__dirname, 'dist') // 所有输出文件的目标路径,我的就是./dist/bundle.js
  }
};
```
![基本使用](http://p3tha6q4v.bkt.clouddn.com/18-2-11/81006787.jpg)
其中，第一行代码使用了Node的内置模块`path`，并且在它前面加上 `__dirname`这个全局变量(也就是第七行代码)。可以防止不同操作系统之间的文件路径问题，并且可以使相对路径按照预期工作。
即使你的index.js内容为空，bundle.js里面也有一些基本的打包代码。

3. 基本的使用
```
//第一种方法，使用当前目录的node_modules里面的webpack
./node_modules/.bin/webpack 
//第二种方法使用npm脚本
//首先在你的package.json里面添加下列代码
{
  ...
  "scripts": {
    "build": "webpack"
  },
  ...
}
//然后，使用下列代码即可
npm run bulid
//第三种方法，高版本的npm自带了npx
npx webpack //npx会自动查找当前依赖包中的可执行文件，如果找不到，就会去 PATH 里找。如果依然找不到，就会帮你安装！
```
所以说呢，我选择了第三种使用方法。
## 把ES6或者其他ES版本js转换成通用的js代码
毫无疑问应该使用`babel`，不过在`webpack`的世界里面统一使用`loader`，所以我们`google webpack babel-loader`。
loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
### 有个坑，很容易搞错的坑
`babel-loader`不同版本的安装脚本、配置文件是不同的……
![小心点](http://p3tha6q4v.bkt.clouddn.com/18-2-11/72818242.jpg)
(*@ο@*) 哇～你搜出的最新的文档用这么小的文字告诉你，你用`webpack 3.x babel-loader 7.x | babel 6.x`的去这个[链接](https://github.com/babel/babel-loader/tree/7.x),`webpack 3.x | babel-loader 8.x | babel 7.x`的去[当前的这链接链接](https://github.com/babel/babel-loader)。
好吧，我用上一版本的吧。
所以我的安装脚本是
```
npm install --save-dev babel-loader babel-core babel-preset-env webpack
```
配置文件是
```
//依然属于webpack.config.js配置的一部分，
module: {
  //这是关于模块的配置
  rules: [
    //模块规则（配置 loader、解析器等选项）
    {
      test: /\.js$/, //使用正则判断后缀是js的文件
      exclude: /(node_modules|bower_components)/, //除了这两目录下的node_modules|bower_components
      use: {
        loader: 'babel-loader', //用这个loader处理.js的文件
        options: {
          presets: ['env'] //选项，还记得单独使用babel的时候建立的那个.babelrc嘛，就是那个作用。
        }
      }
    }
  ]
}
```
借此可以得到`loader`的两个作用：
1. 识别出应该被对应的 loader 进行转换的那些文件。(使用 test 属性)
2. 转换这些文件，从而使其能够被添加到依赖中（并且最终添加到 bundle 中）(use 属性)
### V1.0的Commit借助它完成的功能
在`./src/js/`有三个js文件，都是新的语法，用的模块化写法(两个Module.js的export,以及app.js的import)，有的浏览器不支持，所以需要转化。
***
*最终效果，打开的我的预览链接*,使用`ctrl+shift+J`，会看到打印出1和2
***
## 把scss文件变成css并加入到html里面
思路同上，`google webpack scss`
得到如下代码
```
npm install sass-loader node-sass webpack --save-dev
```
模块配置文件
```
// webpack.config.js
module.exports = {
	...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }]
    }
};
```
这个官方的就比较给力了，很清楚地用法
1. 先用sass-loader把`./src/csa/main.scss`变成main.css
2. 再用css-loader把main.css变成符合CommonJS规范的
3. 把main.css变成js字符串，并创建style节点，把它放进去，这样html就可以显示啦。
不过坑爹依旧☺……用的时候报错喽～
![缺俩文件](http://p3tha6q4v.bkt.clouddn.com/18-2-11/2444698.jpg)
一看配置文件，明显缺俩loader啊，自己下载把
```
npm i --save-dev css-loader style-loader
```
![style标签](http://p3tha6q4v.bkt.clouddn.com/18-2-11/60086288.jpg)
***
所以，打开我的预览链接，会看到我的预览的背景是灰色的。
***
### V1.0的Commit的时候的webpack.config.js最终代码
```
const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js/')
  },
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    },
    {
	    test: /\.scss$/,
	    use: [{
	        loader: "style-loader" // creates style nodes from JS strings
        }, {
	        loader: "css-loader" // translates CSS into CommonJS
        }, {
	        loader: "sass-loader" // compiles Sass to CSS
        }]
	    }	  
  ]
}
};
```
所以借助webpack强大的模块化，通过其构建的依赖关系图(dependency graph)把js、scss都搞到了bundle.js里面，真是牛～
***
好啦～期待下次学习其他loader啦\(^o^)/~
***
