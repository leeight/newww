## 环境的准备

新版的 npm-www 不再直接跟 couchdb 交互，而是通过一个 USER_API （HTTP接口）来获取 couchdb 的数据，因此我们新增了一个 `efe` 目录来实现近似的 USER_API 的功能。

## 服务启动

### couchdb

> 默认使用的端口是 8984


```
couchdb -a prd/couch/couch.ini
```

### user-api & search-api

> 默认使用的是5003端口

```
cd efe
bin/www
```

### redis

```
redis-server
```

### edp-www

> 编辑 .env 文件，把 ELASTICSEARCH_URL 和 USER_API 都设置为 http://localhost:5003

```
gulp build
HOST=0.0.0.0 PORT=8445 npm start
```

然后就可以访问 <http://localhost:8445> 来查看效果了
