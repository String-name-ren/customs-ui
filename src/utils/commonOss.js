/**
 *  公用OSS组件
 *  支持阿里云OSS、亚马逊S3文件客户端文件上传
 *  @author: liujiao
 *  @date: 2020/02/26 10:48:20
 */

'use strict';
import Utils from 'utils/util';

var ALIYUN = require('ali-oss');
var AWS = require("aws-sdk");
export default {

    /**
     * 创建随机字符串
     * @param num
     * @returns {string}
     */
    randomString (num) {
        let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let res = '';
        for (let i = 0; i < num; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    },

    /**
     * 创建Aliyun oss客户端对象
     * @param ossConfig OSS上传STS配置
     * @returns {*}
     */
    createAliyunOssClient (ossConfig) {
        return new Promise((resolve, reject) => {
            let client = new ALIYUN({
                region: ossConfig.region,
                accessKeyId: ossConfig.accessKeyId,
                accessKeySecret: ossConfig.accessKeySecret,
                stsToken: ossConfig.stsToken,
                bucket: ossConfig.bucket
            })
            resolve(client);
        });
    },

    /**
     * 创建AWS S3客户端对象
     * @param ossConfig AWS S3上传STS配置
     * @returns {*}
     */
    createAwsS3Client (ossConfig){
        return new AWS.S3({
            accessKeyId: ossConfig.accessKeyId,
            secretAccessKey: ossConfig.accessKeySecret,
            sessionToken: ossConfig.stsToken,
            region: ossConfig.region
        });
    },

    /**
     * 文件上传
     * @param option 上传文件信息
     * @param ossConfig OSS上传STS配置
     */
    ossUploadFile(option, ossConfig) {
        const self = this;
        let file = option.file;
        // 当前时间
        let dateTime = Utils.dateFormat(new Date(), 'yyyyMMddhhmmss');
        // 4位随机字符串
        let randomStr = self.randomString(10);
        // 文件扩展名
        let extensionName = file.name.substr(file.name.indexOf('.'));
        // 文件名字（相对于根目录的路径 + 文件名）
        let fileName = ossConfig.uploadPath + dateTime + '_' + randomStr + extensionName;
        if (ossConfig.ossType === 'aly'){
            return new Promise((resolve, reject) => {
                // 执行上传
                self.createAliyunOssClient(ossConfig).then(client => {
                    // 异步上传,返回数据
                    resolve({
                        fileName: file.name,
                        fileUrl: fileName
                    });
                    // 上传处理
                    // 分片上传文件
                    client.multipartUpload(fileName, file, {
                        progress: function (p) {
                            let e = {};
                            e.percent = Math.floor(p * 100);
                            // console.log('Progress: ' + p);
                            option.onProgress(e);
                        }
                    }).then((val) => {
                        // console.info(val);
                        if (val.res.statusCode === 200) {
                            option.onSuccess(val);
                            return val;
                        } else {
                            option.onError('阿里云OSS上传失败');
                        }
                    }, err => {
                        option.onError('阿里云OSS上传失败');
                        reject(err);
                    })
                })
            });
        } else if(ossConfig.ossType === 'aws'){
            // 创建AWS S3对象
            var s3Client = self.createAwsS3Client(ossConfig);
            try {
                if(file){
                    var params = {
                        Bucket: ossConfig.bucket,
                        Key: fileName,
                        ContentType: file.type,
                        Body: file,
                        'Access-Control-Allow-Credentials': '*',
                        // ACL可设置为：'private' 或 'public-read' 或 'public-read-write' 或 'authenticated-read'
                        'ACL': 'public-read'
                    };
                    s3Client.upload(params, function (err, data) {
                        if (err != null || data.Location == null || data.Location === ''){
                            console.log(err);  //打印出错误
                            option.onError('亚马逊AWS上传失败');
                        } else {
                            // 组装返回字符串
                            let respData = {'name': fileName, 'res':{'requestUrls': data.Location}};
                            option.onSuccess(respData);
                            return respData;
                        }
                    });
                }
            } catch (e) {
                console.error("亚马逊文件上传异常，异常信息："+ e.message);
                option.onError('亚马逊AWS上传失败');
            }
        } else {
            console.error("上传文件ossType没有匹配到业务处理，ossType：" + ossConfig.ossType);
            option.onError('上传文件ossType没有匹配到业务处理');
        }
    }
}
