# 智能化身生成系统 - 项目文档

## 1. 项目概述

本项目是一个基于Next.js框架开发的数字化身生成系统，主要模拟父母为新生儿申请智能化身的流程，用于处理新生儿身份信息的数字化和验证流程。系统采用现代的加密技术确保数据安全，并实现了多方参与的身份验证机制。

## 2. 技术栈

### 2.1 前端技术

- Next.js 14.2.11
- React 18
- Tailwind CSS
- Ant Design (antd) 5.21.1

### 2.2 核心依赖

- elliptic: 用于椭圆曲线加密
- paillier-js: 实现Paillier同态加密
- shamirs-secret-sharing: 实现Shamir密钥共享
- zustand: 状态管理

## 3. 系统架构

### 3.1 核心模块

1. 用户模块（层级化身生成）
2. 医院模块（生物特征数字化审核）
3. 政府模块（数字化审核）
4. 密钥管理模块

### 3.2 数据流程

1. 用户生成新生儿DID
2. 向医院发送加密请求（REQ1）
3. 医院审核并响应（REP1）
4. 向政府发送加密请求（REQ2）
5. 政府审核并响应（REP2）

## 4. 核心功能

### 4.1 DID生成

- 生成格式：`did:child:{timestamp}-{random}`
- 本地存储管理
- 状态追踪

### 4.2 加密机制

1. 椭圆曲线加密（secp256k1）
   - 用于请求加密
   - 公钥私钥管理

2. Paillier同态加密
   - 支持加密数据的计算
   - 密钥分享机制（2-of-3

### 4.3 审核流程

1. 医院审核
   - 生物特征数据验证
   - 状态管理（未申请/待审核/审核通过）

2. 政府审核
   - 合法性验证
   - 多级审核流程

## 5. 安全特性

### 5.1 数据安全

- 全程加密传输
- 本地存储加密
- 密钥分享机制

### 5.2 访问控制

- 基于token的认证
- 角色权限管理
- 状态验证

## 6. API接口

### 6.1 用户注册

该接口后端并未写，只有前端组件

```javascript
POST /api/register

Request:
{
    "username": string,     // 用户名 required
    "password": string,     // 密码 required
    "registerType": string, // 注册类型 required
    "validation": string    // 验证信息 not optional
}

Response:
{
    "code": "00000",       // 成功代码
    "message": string,     // 响应消息
    "data": {
        "userId": string   // 用户ID
    }
}
```

### 6.2 用户登录

该接口正常运行

```javascript
POST /api/login

Request:
{
    "username": string,    // 用户名
    "password": string     // 密码
}

Response:
{
    "code": string,       // 响应代码
    "message": string,    // 响应消息
    "data": {
        "token": string,  // JWT令牌
        "userId": string  // 用户ID
    }
}
```

### 6.3 退出登陆

该接口不需要跟后端对接，在前端状态管理中实现

```javascript
POST /api/logout

Request:
{
    "token": string      // JWT令牌
}

Response:
{
    "code": "00000",     // 成功代码
    "message": string    // 响应消息
}
```

### 6.4 获取公钥

该接口正常运行

```javascript
POST /api/key

Request:
{
    "id": number          // 机构ID (3:医院, 4:政府)
}

Response:
{
    "code": string,       // 响应代码
    "data": {
        "pk": string      // 公钥 (格式: "(x,y)")
    }
}

错误码:
- 404: 未找到对应机构的公钥
- 500: 服务器内部错误
```

### 6.5 子密钥分享获取

该接口正常运行

```javascript
POST /api/shareKey

Request:
{
    "token": string       // 认证令牌
}

Response:
{
    "code": string,       // 响应代码
    "data": string[]      // 密钥分享数组
}
```

### 6.6 向医院发送请求

该接口向医院发送请求，包含加密数据

```javascript
POST /api/req/req1

Request:
{
    "ciphertext": string,  // 加密的请求数据
    "token": string        // 认证令牌
}

加密前的数据结构:
{
    "DIDi": string,        // 新生儿DID
    "DIDHSAi": string,     // 层级担保人DID
    "biometricWeak": string, // 生物特征数据
    "UOIBFDi": string      // 办公室标识符
}

Response:
{
    "code": string,        // 响应代码 ("0":失败, "1":成功)
    "message": string      // 响应消息
}
```

### 6.7 向政府发送请求

该接口向政府发送请求，包含加密数据

```javascript
POST /api/req/req2

Request:
{
    "ciphertext": string,  // 加密的请求数据
    "token": string        // 认证令牌
}

加密前的数据结构:
{
    "DIDi": string,        // 新生儿DID
    "DIDHSAi": string,     // 层级担保人DID
    "UOIMVi": string,      // 政府机构标识符
    "PIIHSAi": string,     // HSA个人信息
    "PIIi": string,        // 新生儿个人信息
    "hash": string         // 验证哈希
}

Response:
{
    "code": string,        // 响应代码 ("0":失败, "1":成功)
    "message": string      // 响应消息
}
```

### 6.8 获取用户类型

该接口获取用户类型,主要用于用户类型判断

```javascript
POST /api/userType

Request:
{
    "token": string      // 认证令牌
}

Response:
{
    "code": string,      // 响应代码
    "data": string       // 用户类型
}
```

### 6.9 获取审核列表

该接口获取审核列表，主要用于审核列表展示

医院、政府类似地

GET /api/list

```javascript
GET /api/list

Response:
{
    "code": string,       // 响应代码 ("0":失败, "1":成功)
    "message": string,    // 响应消息
    "data": array        // 审核列表
}

```

### 6.10 审核请求

医院

POST /api/rep/rep1

政府

POST /api/rep/rep2

类似地

```javascript
POST /api/rep/rep1

Request:
{
    "id": number          // 审核请求id
}

Response:
{
    "code": string,       // 响应代码 ("0":失败, "1":成功)
    "message": string     // 响应消息
}
```

### 6.11 智能化身

- 账号申请

```javascript
POST /api/avatar/apply

Request:
{
    "token": string      // 认证令牌
}

Response:
{
    "code": string,      // 响应代码
    "message": string    // 响应消息
    "data": string       // 账号id
}
```

- 账号查询

```javascript
POST /api/avatar/query

Request:
{
    "token": string         // 认证令牌
}

Response:
{
    "code": string,      // 响应代码
    "message": string    // 响应消息
    "data": string       // 账号信息
}
```

- 下载化身

```javascript
POST /api/avatar/download

Request:
{}

Response:
{
    "code": string,      // 响应代码
    "message": string    // 响应消息
    "data": string       // 账号信息
}
```

## 7. 部署说明

### 7.1 环境要求

- Node.js 环境
- npm/yarn包管理器

### 7.2 安装步骤

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 生产环境运行
npm run start
```

### 7.3 配置说明

- 默认端口：3001
- 开发环境：http://localhost:3001
- 环境变量本项目未配置，后续可自建.env文件（包含服务器地址等）
