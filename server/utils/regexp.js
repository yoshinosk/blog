exports.isNumber = val => /^[0-9]*$/.test(val)

exports.nicknameCheck = val => /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/.test(val)