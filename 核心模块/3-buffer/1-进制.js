/*
 * @Author: 毛毛 
 * @Date: 2022-05-30 14:14:06 
 * @Last Modified by: 毛毛
 * @Last Modified time: 2022-05-30 14:39:45
 * 
 * Buffer node要大量操作文件 所以就搞了一个buffer 代表的就是内存
 * 最早的时候 浏览器是不支持文件读取的，但是node中需要操作文件 buffer优点是可以和字符串相互转换
 * 
 * 内存怎么表示，存的是什么？ 存的是二进制
 * 
 * 0.1 + 0.2 !== 0.3
 */
const buffer = Buffer.from("mao");// 内部 16 进制表示的
console.log(buffer,buffer.toString())