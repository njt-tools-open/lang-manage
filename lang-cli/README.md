## 简介

lang-manage 作为一个多语言包的管理小工具, 主要是为了解决多语言在不同文件中难以统一管理的问题. 体现在同 key 统一添加/删除, 并且可在同个视图内修改同一 key 的内容, 彻底解决跨文件修改不同语言容易出现缺漏的问题.

## 使用

### 安装 lang-manage

```sh
# or pnpm install or yarn install
$ npm install @njt-tools-open/lang-manage
```

### 启动维护目录

进入到需要维护的语言包目录的上层目录

目录以及文件结构:

![](https://raw.githubusercontent.com/njt-tools-open/lang-manage/master/lang-cli/assets/folder.png)

执行命令

```sh
$ langm start --folder <folder_name> --name <project_name>
```

此时会打开当前语言包概览界面

![](https://raw.githubusercontent.com/njt-tools-open/lang-manage/master/lang-cli/assets/overview.png)

可以切换到修改标签下, 进行语言包的修改

![](https://raw.githubusercontent.com/njt-tools-open/lang-manage/master/lang-cli/assets/modify.png)

## 其他指令

### 项目列表 GUI

```sh
$ langm open
```

![](https://raw.githubusercontent.com/njt-tools-open/lang-manage/master/lang-cli/assets/home.png)

### 维护列表

通过以下指令查看正在维护的语言包目录

```sh
$ langm list
```

### 删除维护目录

通过以下指令删除不需要继续维护的语言包目录

```sh
# by name
$ langm delete --name <folder_name>
# by id
$ langm delete --id <folder_id>
```

### 关闭 lang-manage 服务

```sh
$ langm stop
```
