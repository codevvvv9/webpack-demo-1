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
### path
其中，第一行代码使用了Node的内置模块`path`,并且在它前面加上 `__dirname`这个全局变量(也就是第七行代码)。可以防止不同操作系统之间的文件路径问题，并且可以使相对路径按照预期工作。
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
*最终效果，打开的[我的预览链接](https://codevvvv9.github.io/webpack-demo-1/dist/index.html)*,使用`ctrl+shift+J`，会看到打印出1和2
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
所以，打开[我的预览链接](https://codevvvv9.github.io/webpack-demo-1/dist/index.html)，会看到我的预览的背景是灰色的。
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
## 搞了一个html-loader，本想优化html的，可是实际使用中没有报错，但是好像没啥效果，比较尴尬
## Copy Webpack Plugin这个插件很好用啊
目前呢，前面的loader用的都很爽。在src目录下修改完了代码，一个npx webpack，刷新就可以看到效果了，体验很棒。
但是今天坐在电脑前面，回想代码，在前端工程话的道路上，scss、js、html都是被监视着(wacth)，src下一有风吹草动，就会把修改后的代码更新过去。
- 目前使用的webpack可以完全自动化`scss、js`了，可我如果修改了src/index.html，dist/也无法获知我的修改啊
- 然后我google一一会，发现了这货`Copy Webpack Plugin` 

哎呀，是个`plugin`，终于webpack的四大基本概念都到齐了,前面搞了`entry output loder`，今天用一下`plugin`。
> loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。
基本安装
```
npm i -D copy-webpack-plugin
```
Copy Webpack Plugin配置文件(plugin的和loader的配置文件可不是一个套路。loader是在module.rules数组的每一个对象里面(即rules数组的每一个value)，而plugin是在module的plugins数组里面)
```
//依然在webpack.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  plugins: [
    new CopyWebpackPlugin([ ...patterns ], options)
  ]
}
```
[Copy Webpack Plugin的github](https://github.com/webpack-contrib/copy-webpack-plugin#to)给的代码，一开始把我搞蒙了，和webpack官网的代码不大一样啊。后来才发现原来用了`module.exports = config;`
在我的小demo里使用的是
```
plugins: [
    new CopyWebpackPlugin([ {
      //原来一个plugin就是一个对象啊，使用的时候实例化对象即可
      from: 'src/index.html', //从src/index.html目录下复制
      to: '../index.html',  //到dist/index.html
      toType: 'file' //复制类型是文件
    }], { copyUnmodified: true }) //把未修改的部分也复制过去
  ]
```
这个插件可以实现很多功能，具体的细节看[这里](https://github.com/webpack-contrib/copy-webpack-plugin#to)
### 关于目录的一个小问题
上面代码为什么这么写呢` to: '../index.html',` ，试了好几遍发现没有报错，就是没有结果，最后搞明白了是路径的问题……
还记得 四大基本概念的`output`里面的path吗，回头看一开始的[path](#path)
```
output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js/')
},
```
项目的path是`dist/js`下，所以应该复制到上一级目录下`../`也就是`dist/`目录下了。
### 至此可以看到[预览链接](https://codevvvv9.github.io/webpack-demo-1/dist/index.html)里面的文字啦
动态效果可以看下图
![动态效果](http://p3tha6q4v.bkt.clouddn.com/18-2-12/50816812.jpg)
## 上一次提交的遗留的小问题
上一次使用了`display： flex`把`ul>li`变成了横排，但是这玩意有兼容性，可以去[caniuse](https://caniuse.com/#feat=flexbox) 看一下,(*@ο@*) 哇～IE没有绿的哎，支持太差了。( ⊙ o ⊙ )！万一以后我项目搞大了，IE的用户、老安卓的用户想看我项目咋办呢，只能加一下前缀优化一下啦。
有个挺牛的[在线的autoprefixer](https://autoprefixer.github.io/)，也可以去在线转换。
既然使用了webpack就`Google webpack autoprefixer`，遗憾的发现`autoprefixer`官方推荐使用`postcss-loader`
![autoprefixer过期了](http://p3tha6q4v.bkt.clouddn.com/18-2-12/79391220.jpg)
### postcss-loader解决兼容性问题
先吐槽一下，这货的文档也是稀烂……
1. 官方安装脚本

```
npm i -D postcss-loader
```
2. 需要单独配置文件postcss.config.js，官方的写法是下面这个（最无语的就是这个……，*下面的必错，写出来就是警告大家，官方的也不一定对*）

```
module.exports = {
  parser: 'sugarss', // 铪？？？？解析器是sugarss???
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {},
    'cssnano': {}
  }
}
```
在webpack.config.js的添加时还要注意下面的几点
> After setting up your postcss.config.js, add postcss-loader to your webpack.config.js. You can use it standalone or in conjunction with css-loader (recommended). Use it after css-loader and style-loader, but before other preprocessor loaders like e.g sass|less|stylus-loader, if you use any.

这段文档的要点就是让你注意`postcss-loader`应该在`css-loader style-loader`之后，但是一定要在其他的预处理器`preprocessor loaders`之前，例如
`sass|less|stylus-loader`。

3. 官方给了一个推荐的配置代码

```
//依然是webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  }
}
```
本项目用的是`.src/css/main.scss`,只能尝试着将上述代码加到相应的位置
```
rules: [
    ...
	{
		test: /\.scss$/,
		use: [{
			loader: "style-loader" // creates style nodes from JS strings
		}, {
			loader: "css-loader", options: { importLoaders: 1 }// translates CSS into CommonJS
		}, {
			loader: "postcss-loader"
		}, {
			loader: "sass-loader" // compiles Sass to CSS
		}]
	},
   ...
   ]
```
***
下面的几点可都是官网文档没写的，只能自己踩一踩的坑……
***
4. 运行`npx webpack`,*连续报错*，不过是缺必备的module的错误,也就是缺postcss.config.js里面的`postcss-import postcss-cssnext cssnano sugarss` 。
没办法，先`npm i -D 上面的四个模块名字`，依然报错，这次是语法错误
![语法错误](http://p3tha6q4v.bkt.clouddn.com/18-2-12/21058876.jpg)
(⊙v⊙)嗯？？？它说我不必要的大括号？？？我这标准的scss语法啊，又不是sass的语法(它省略了大括号和分号)，先Google一波这个错误。
终于在在postcss的[issue](https://github.com/postcss/postcss/issues/1062)里面发现了蛛丝马迹,问题果然出在那个令我疑惑的`postcss.config.js`里面
### 错误原因分析
1. 错误的使用了[sugarss](https://github.com/postcss/sugarss)的解析器(这货和sass类似，没有大括号，所以它说我大括号错了，它的特点是Indent-based CSS syntax for PostCSS.SugarSS MIME-type is text/x-sugarss with .sss file extension.)，而我写的是scss语法。
2. `postcss-loader`哪来的勇气确定大家都是用的`.sss`后缀的sugarss语法呢，还敢直接在文档的醒目位置写的`稀烂的postcss.config.js`，O__O "…
3. 那么多的预编译的css语法，果然需要webpack打包工具啊，找到合适的loader去解析啊。

注释掉`parser: 'sugarss',`这句代码，可以使用默认的解析器去解析了，正常运行了。
不过查看代码，发现好像转换后的css有点小丑
![不好看](http://p3tha6q4v.bkt.clouddn.com/18-2-12/6839932.jpg)

仔细观察命令行，发现有线索，一个警告
![警告](http://p3tha6q4v.bkt.clouddn.com/18-2-12/77557219.jpg)
警告信息提示我说：postcss-cssnext发现有个冗余的`autoprefixer`插件在我的postcss插件里面，这个可能有不良影响，我应该移除它，因为它已经包括在了postcss-cssnext里面。

webpack的警告说的很明白，postcss-cssnext是无辜的，而且我确定按照官网代码走的，没有安装`autoprefixer`插件，错误必然在剩下的两个插件里面了。
```
//修改后的postcss.config.js只剩下这些了
module.exports = {
  plugins: {
    'postcss-import': {}, //1.它错了？
    'postcss-cssnext': {}, //webpack告诉我它是清白的
    'cssnano': {} //2.它错了？
  }
}
```
我选择了排除法：
1. 先注释`'postcss-import': {},`，发现无法转换后的css代码不对，说明它是无辜的。
2. 那么问题必然是最后一个插件，注释掉`'cssnano': {}`，终于完美了，而且代码很优美。
![消除警告](http://p3tha6q4v.bkt.clouddn.com/18-2-12/85971803.jpg)

本着打破砂锅问到底的精神，我搜了一下`cssnano`,在其[官网](http://cssnano.co/optimisations/autoprefixer/)看到了真实的错误原因，webpack很明智啊，诚不欺我，果然冗余插件了。
![警告的原因](http://p3tha6q4v.bkt.clouddn.com/18-2-13/83651219.jpg)
cssnano里面有`autoprefixer`导致了冗余。

呼，总算，搞定了webpack的基本使用了，最简单的符合我目前技术栈的各种loader,plugin都会安装了。
当然，还有无数的webpack的loader、plugin在前方等着我去探索……各种稀奇古怪的配置文件……痛并快乐着☺

