const multer = require('multer'),
    { MulterError } = require('multer'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    moment = require('moment'),
    Response = require('../../utils/response');


    
function uploadImg() {
    let storage = multer.diskStorage({
        destination: async function (req, file, cb) {
            let date = moment(new Date()).format('YYYYMMDD'),
                dir = path.join(`public/uploads`, date)
            await mkdirp(dir)
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });
    return multer({
        storage,
        limits: {
            files: 6,
            fileSize: 1024 * 50000 // 单位为byte 
        },
        fileFilter(req, file, cb) {
            if (/(gif|jpg|jpeg|png|GIF|JPG|PNG|bmp|BMP)/.test(file.mimetype)) cb(null, true)
            else cb(new MulterError('LIMIT_FILE_TYPE'), false)
        }
    }).array('files', 10)
}

function uploadAvatar(){
    let storage = multer.diskStorage({
        destination: async function (req, file, cb) {
            let dir = path.join('public/uploads/avatar')
            await mkdirp(dir)
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            console.log(file);
            cb(null, parseInt(Date.now() / 1000) + '-' + file.originalname)
        }
    });
    return multer({
        storage,
        limits: {
            files: 1,
            fileSize: 1024 * 20000 // 单位为byte 
        },
        fileFilter(req, file, cb) {
            if (/(gif|jpg|jpeg|png|GIF|JPG|PNG|bmp|BMP)/.test(file.mimetype)) cb(null, true)
            else cb(new MulterError('LIMIT_FILE_TYPE'), false)
        }
    }).single('avatar')
}


const upload = uploadImg()

const avatar = uploadAvatar()

module.exports = {
    /**
     * @description 上传图片
     * @param {Request} req 
     * @param {Response} res 
     */
    uploadImg(req, res) {
        // res.status(400).send(Response.error.MISPARAM)
        upload(req, res, err => {
            if (err) {
                res.status(400).send(Response.error[err.code]);
            } else {
                res.status(200).send(Response.success('上传图片成功', req.files.map(item => item.path.replace('public', '').replace(/\\/g, '\/'))))
            }
        })
    },
    uploadAvatar(req, res){
        avatar(req, res, err => {
            if (err) {
                res.status(400).send(Response.error[err.code]);
            } else {
                res.status(200).send(Response.success('上传头像成功', req.file.path.replace('public', '').replace(/\\/g, '\/')))
            }
        })
    }
};