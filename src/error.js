const HttpStatus = require('http-status-codes')

const getTransformedError = require('./getTransformedError')

module.exports = (callback) => (err, req, res, next) => {
    const { status, error, message = '' } = getTransformedError(err)

    callback && callback(req, res, { status, error, message })

    if (status === HttpStatus.UNAUTHORIZED) {
        return res.status(status).send()
    }

    return error && message
        ? res.status(status).json({ status, error, message })
        : res.status(status).send()
}