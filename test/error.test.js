var expect = require('chai').expect

const getTransformedError = require('../src/getTransformedError')

describe('getTransformedError', function () {
    describe('isBoom', function () {
        it('isBoom deve retornar objeto padrão de erro', function () {
            const errorObj = getTransformedError({
                isBoom: true,
                output: {
                    statusCode: 404,
                    payload: {
                        message: 'NotFound'
                    }
                }
            })
            expect(errorObj).to.have.property('status')
            expect(errorObj.status).to.equal(404)
            expect(errorObj).to.have.property('message')
            expect(errorObj.message).to.equal('NotFound')
        });
        it('isBoom deve retornar objeto padrão internal server error se não possuir corpo esperado', function () {
            const errorObj = getTransformedError({
                isBoom: true,
                out: {status: 404}
            })
            expect(errorObj).to.have.property('status')
            expect(errorObj.status).to.equal(500)
            expect(errorObj).to.have.property('error')
            expect(errorObj.error).to.equal('Internal Server Error')
        });
    });
    describe('isAxiosError', function () {
        it('isAxiosError deve retornar objeto padrão de erro', function () {
            const errorObj = getTransformedError({
                isAxiosError: true,
                response: {
                    status: 404,
                    data: {
                        message: 'NotFound'
                    }
                }
            })
            expect(errorObj).to.have.property('status')
            expect(errorObj.status).to.equal(404)
            expect(errorObj).to.have.property('message')
            expect(errorObj.message).to.equal('NotFound')
        });
        it('isAxiosError deve retornar objeto padrão internal server error se não possuir corpo esperado', function () {
            const errorObj = getTransformedError({
                isAxiosError: true,
                out: {status: 404}
            });
            expect(errorObj).to.have.property('status')
            expect(errorObj.status).to.equal(500)
            expect(errorObj).to.have.property('error')
            expect(errorObj.error).to.equal('Internal Server Error')
        });
    });
    describe('errStatusMessageProp', function () {
        it('errStatusMessageProp deve retornar objeto padrão de erro', function () {
            const errorObj = getTransformedError({
                status: 404,
                message: 'NotFound'
            })
            expect(errorObj).to.have.property('status')
            expect(errorObj.status).to.equal(404)
            expect(errorObj).to.have.property('message')
            expect(errorObj.message).to.equal('NotFound')
        });
    });
    describe('errErrorsArrayProp', function () {
        it('errErrorsArrayProp deve retornar objeto padrão de erro', function () {
            const errorObj = getTransformedError({
                errors: [
                    {
                        message: 'NotFound'
                    },
                    {
                        message: 'NotAllowed'
                    }
                ]
            })
            expect(errorObj).to.have.property('status')
            expect(errorObj.status).to.equal(422)
            expect(errorObj).to.have.property('message')
            expect(errorObj.message).to.equal('NotFound,NotAllowed')
        });
    });
});