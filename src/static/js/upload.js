import { Message } from 'element-ui'

/**
 *
 * @param {file} file 源文件
 * @desc 限制为图片文件
 * @retutn 是图片文件返回true否则返回false
 */
export const isImageFile = (file,fileTypes) => {
    const types =fileTypes|| [
        'image/png',
        'image/gif',
        'image/jpeg',
        'image/jpg',
        'image/bmp',
        'image/x-icon'
    ]
    const isImage = types.includes(file.type)
    if (!isImage) {
        Message.error('上传文件非图片格式!')
        return false
    }

    return true
}

/**
 *
 * @param {file} file 源文件
 * @param {number} fileMaxSize  图片限制大小单位（MB）
 * @desc 限制为文件上传大小
 * @retutn 在限制内返回true否则返回false
 */
export const isMaxFileSize = (file, fileMaxSize = 2) => {
    const isMaxSize = file.size / 1024 / 1024 < fileMaxSize
    if (!isMaxSize) {
        Message.error('上传头像图片大小不能超过 ' + fileMaxSize + 'MB!')
        return false
    }
    return true
}

/**
 *
 * @param {file} file 源文件
 * @desc 读取图片文件为base64文件格式
 * @retutn 返回base64文件
 */
export const readFile = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
            const data = e.target.result
            resolve(data)
        }
        reader.onerror = () => {
            const err = new Error('读取图片失败')
            reject(err.message)
        }

        reader.readAsDataURL(file)
    })
}

/**
 *
 * @param {string} src  图片地址
 * @desc 加载真实图片
 * @return 读取成功返回图片真实宽高对象 ag: {width:100,height:100}
 */
export const loadImage = src => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.onload = () => {
            const data = {
                width: image.width,
                height: image.height
            }
            resolve(data)
        }
        image.onerror = () => {
            const err = new Error('加载图片失败')
            reject(err)
        }
    })
}

/**
 *
 * @param {file} file 源文件
 * @param {object} props   文件分辨率的宽和高   ag: props={width:100, height :100}
 * @desc  判断图片文件的分辨率是否在限定范围之内
 * @throw  分辨率不在限定范围之内则抛出异常
 *
 */
export const isAppropriateResolution = async(file, props) => {
    try {
        const { width, height } = props
        const base64 = await readFile(file)
        const image = await loadImage(base64)
        if (image.width !== width || image.height !== height) {
            throw new Error('上传图片的分辨率必须为' + width + '*' + height)
        }
    } catch (error) {
        throw error
    }
}

/**
 *
 * @param {file} file 源文件
 * @param {array} ratio   限制的文件比例 ag:  ratio= [1,1]
 * @desc 判断图片文件的比列是否在限定范围
 * @throw  比例不在限定范围之内则抛出异常
 */
export const isAppRatio = async(file, ratio) => {
    try {
        const [w, h] = ratio
        if (h === 0 || w === 0) {
            const err = '上传图片的比例不能出现0'
            Message.error(err)
            throw new Error(err)
        }
        const base64 = await readFile(file)
        const image = await loadImage(base64)
        if (image.width / image.height !== w / h) {
            throw new Error('上传图片的宽高比例必须为 ' + w + ' : ' + h)
        }
    } catch (error) {
        throw error
    }
}
