const HttpStatus = require('http-status-codes')

const toUnifiedError = ({ status, message = '' }) => {
    const error = HttpStatus.getReasonPhrase(status)
    const payload = { status, error }
    if (message && message.toLowerCase() !== error.toLowerCase()) {
        return { ...payload, message }
    }
    return payload
}

const getTransformedError = (err) => {
    if (err.isBoom) {
        return toUnifiedError({
            status: err && err.output && err.output.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            message: err && err.output && err.output.payload && err.output.payload.message ||
                HttpStatus.getReasonPhrase(HttpStatus.INTERNAL_SERVER_ERROR),
        })
    } else if (err.isAxiosError) {
        return toUnifiedError({
            status: err && err.response && err.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
            message: err && err.response && err.response.data && err.response.data.message ||
                HttpStatus.getReasonPhrase(HttpStatus.INTERNAL_SERVER_ERROR),
        })
    }
    if (Array.isArray(err.errors)) {
        const message = err.errors
            .map((item) => item.message)
            .filter((msg) => !!msg)
            .join(',')
        return toUnifiedError({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message:
                message || HttpStatus.getReasonPhrase(HttpStatus.UNPROCESSABLE_ENTITY),
        })
    } else if (err.status && err.message) {
        return toUnifiedError({
            status: err.status,
            message: err.message,
        })
    } else {
        return toUnifiedError({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message:
                err.message ||
                HttpStatus.getReasonPhrase(HttpStatus.INTERNAL_SERVER_ERROR),
        })
    }
}

module.exports = getTransformedError