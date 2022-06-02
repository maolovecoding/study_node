const buf = Buffer.from("珠");
console.log(buf); // <Buffer e7 8f a0>

// base64的转换
//  e7 8f a0  -> 24位  转换后每一位小于64
console.log((0xe7).toString("2"));
console.log((0x8f).toString("2"));
console.log((0xa0).toString("2"));
// 11100111  10001111  10100000
// 111001 111000  111110 100000
// 00111001 00111000  00111110  00100000 3个字节转为4个字节大小了
console.log(parseInt("00111001", 2));
console.log(parseInt("00111000", 2));
console.log(parseInt("00111110", 2));
console.log(parseInt("00100000", 2));
// 57 56 62 32

// base64 编码对照表
let code = "ABCDEFGHIGKLMNOPQRSTUVWXYZ";
code += code.toLowerCase();
code += "0123456789+/";
// 54+g
console.log(code[57] + code[56] + code[62] + code[32]);
