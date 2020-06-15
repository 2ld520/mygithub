# biyesheji

## 项目部分效果演示
### 1.用户认证
#### 1.1 首先,在后台管理系统中添加姓名为李四的学生信息，设置初始密码(123456)，学号(12345678),学校(厦门理工学院),以及其他个人信息.
![image](https://github.com/zhuangludong/mygithub/blob/master/add.gif )
#### 1.2 然后进入到用户端,进行平台账号注册，注册时会先检测账号,手机号是否已存在,<br>账号有效才会弹出认证窗口,进行身份认证,只有当身份信息正确时才能成功注册。
![image](https://github.com/zhuangludong/mygithub/blob/master/login.gif )
### 2.平台首页
#### 注册成功后自动登入平台,可以通过底部导航栏在首页和个人页面进行切换<br>个人页面可以修改头像,姓名
![image](https://github.com/zhuangludong/mygithub/blob/master/index.gif )
### 3. 在线缴费模块
#### 在后台管理系统对账户(李四)进行充值和扣费,用户端进行缴费
![image](https://github.com/zhuangludong/mygithub/blob/master/jiaofei.gif )
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
