const HttpStatus = require('http-status-codes')

/**
 * @param status
 * @param message
 * @returns {{error: string, message, status: *}|{error: string, status: *}}
 */
const toUnifiedError = ({ status, message = '' }) => {
    const error = HttpStatus.getReasonPhrase(status)
    const payload = { status, error }
    if (message && message.toLowerCase() !== error.toLowerCase()) {
        return { ...payload, message }
    }
    return payload
}

/**
 * @param err
 * @returns {{isBoom}|*|Boom<unknown>}
 */
const getTransformedError = (err) => {
    if (err.isBoom) {
        return toUnifiedError({
            status: err.output.statusCode,
            message: err.output.payload.message,
        })
    } else if (err.isAxiosError) {
        return toUnifiedError({
            status: err?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            message: err?.response?.data?.message || '',
        })
    } if (Array.isArray(err.errors)) {
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

module.exports = (logger) =>  (err, req, res, next) => {
    const { status, error, message = '' } = getTransformedError(err)

    logger && logger(req, res, {status, error, message})

    if (status === HttpStatus.UNAUTHORIZED) {
        return res.status(status).send()
    }

    return error && message
        ? res.status(status).json({ status, error, message })
        : res.status(status).send()
}