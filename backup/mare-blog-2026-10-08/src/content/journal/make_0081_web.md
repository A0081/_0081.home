---
title: 关于本站搭建
pubDate: 2022-06-12
---
## 准备工作

- [Github](https://github.com/)(代码仓库)
- [Netlify](https://www.netlify.com/)(部署工具)
- [Hexo](https://hexo.io/zh-cn/)(静态站点生成器/网站生成器)
- [Maupassant](https://github.com/tufu9441/maupassant-hexo)(网站主题)
- [腾讯云](https://cloud.tencent.com/)(域名购买,不买也行,可以部署到git page,就是国内访问可能很慢)
<!-- more -->
注册一个github帐号,一个腾讯云帐号或任何能购买域名的云服务商的帐号(阿里云,华为云,namecheap)

这些除了域名可能花几块钱,其余都是免费!当然,可能有免费域名,这里不做提供.

### 安装 Git

- Windows：下载并安装 [git](https://git-scm.com/download/win)。
- Mac：使用 [Homebrew](http://mxcl.github.com/homebrew/), [MacPorts](http://www.macports.org/) 或者下载 [安装程序](http://sourceforge.net/projects/git-osx-installer/)。
- Linux (Ubuntu, Debian)：`sudo apt-get install git-core`
- Linux (Fedora, Red Hat, CentOS)：`sudo yum install git-core`
- Linux(ArchLinux): `sudo pacman -S git`

> Mac 用户
>
> 如果在编译时可能会遇到问题。 请先到 App Store 安装 Xcode。 Xcode 完成后，启动并进入 **Preferences -> Download -> Command Line Tools -> Install** 安装命令行工具。

### 安装 Node.js

Node.js 为大多数平台提供了官方的 [安装程序](https://nodejs.org/zh-cn/download/)。

其它的安装方法：

- Windows：通过 [nvs](https://github.com/jasongin/nvs/)（推荐）或者 [nvm](https://github.com/nvm-sh/nvm) 安装。
- Mac：使用 [Homebrew](https://brew.sh/) 或 [MacPorts](http://www.macports.org/) 安装。
- Linux（DEB/RPM-based）：从 [NodeSource](https://github.com/nodesource/distributions) 安装。
- Linux  (Archlinux): `sudo pacman -S nodejs`
- 其它：使用相应的软件包管理器进行安装。 可以参考由 Node.js 提供的 [指导](https://nodejs.org/en/download/package-manager/)。



## 网站基本构建

### 创建文件夹

什么项目不是从这一步开始呢?名字大概是类似xx_blog, xx.websit, xxx都行

```bash
# 创建文件夹
# 以下操作为Linux环境下完成,Windows用户右键-新建文件夹-右键,git bash here
mkdir _0081.website ## _0081.website就是我的文件夹名了
cd _0081.website ## 进入文件夹
```

### 安装hexo

```bash
npm install -g hexo-cli #安装hexo
```

### 主题安装

安装主题和渲染器：

```bash
git clone https://github.com/tufu9441/maupassant-hexo.git themes/maupassant  
npm install hexo-renderer-pug --save  
npm install hexo-renderer-sass --save  
```

编辑Hexo目录下的 `_config.yml`，将`theme`的值改为`maupassant`。

注：依赖`hexo-renderer-sass`安装时容易报错，很可能是国内网络问题，请尝试使用代理或者切换至NPM的国内镜像源安装。

### 主题设置与网站内容

主题设置移步https://www.haomwei.com/technology/maupassant-hexo.html

网站内容如何编写参考[hexo中文文档](https://hexo.io/zh-cn/docs/writing)

## 上传github(代码仓库)

### 创建代码仓库

注册好github就是这样的!!!

![new_repo](/images/new_repo.png)

![config_repo](/images/config_repo.png)

![2024-07-28 10-27-19屏幕截图](/images/repo_command.png)

```bash
如果报错是还没有配置git
git config --global user.name "xxx" # xxx为你github用户名
git config --global user.email "xxx@163.com" # 你的邮箱
ssh-keygen -t rsa -C "xxx@163.com" #一路回车
cat .ssh/id_rsa.pub # 将公钥复制
```

打开github-->点头像-->settings-->SSH and GPG keys--->NEW SSH key --->粘贴公钥(title随便)

之后重新输入红框代码

## 网站部署

一切完成后如下图

![2024-07-28 10-41-33屏幕截图](/images/ckyl.png)

打开[Netlify](https://www.netlify.com/)右上角LOG IN用github帐号登录.

如图:

![然](/images/netlify_yl.png)

然后点击github,找到你的仓库

![2024-07-28 10-50-58屏幕截图](/images/publish.png)

其他默认就好

```bash
# Publish dirctory改为
public/
# Bulid command改为
hexo generate
```

就完成了,部署完成后会生成一个netlify.app结尾的子域名,点击就能成功访问!

## 域名解析

接下来就是部署将自己的域名解析到netlify.app结尾的子域名

打开[腾讯云](https://cloud.tencent.com/)控制台(你应该已经在第一步就买好了域名)

找到域名解析

添加记录/新手快速解析

![2024-07-28 10-59-37屏幕截图](/images/tx_dns.png)

**主机记录**,就是主机名,例如：`manjaro.i0081.asia`，`arco.i0081.asia`。这其中`i0081.asia`是我购买的域名，`manjaro.i0081.asia`，`arco.i0081.asia`是我的子域名，这里你如果只有一个网站，可以直接填@，将`i0081.asia`解析到你的网站，如果有不同网站需要不同子域名，那也可以自定义一个名称。

**记录类型**填CNAME

**记录值：**就是netlify.app结尾的子域名，如图：

![2024-07-28 11-06-41屏幕截图](/images/dns_domain.png)

确认，切换到Netlify，你的域名后边的黄色三角感叹号消失后，就解析成功了。

如果解析成功，netlify.app结尾的子域名能访问，自己的域名访问不成功，重启一下电脑。

## 完成 

