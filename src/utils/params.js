// 以下代码存储所有参数

import { ec as EC } from 'elliptic';

// 创建椭圆曲线实例(使用secp256k1曲线作为示例)
const ec = new EC('secp256k1');

// 生成密钥对
const keyPair = ec.genKeyPair();

// 获取曲线参数
const curve = ec.curve;

// 导出参数
export const params = {
  P: curve.p,  // 素数p
  a: curve.a,  // 系数a
  b: curve.b,  // 系数b
  G: curve.g,  // 基点G
  n: curve.n,  // 阶n
  equation: (x, y) => {
    return y.pow(2).sub(x.pow(3).add(curve.a.mul(x)).add(curve.b)).mod(curve.p);
  },
  isOnCurve: (x, y) => {
    return curve.validate(x, y);
  }
};

// 根据需要导出公钥和私钥
export const publicKey = keyPair.getPublic();
export const privateKey = keyPair.getPrivate();