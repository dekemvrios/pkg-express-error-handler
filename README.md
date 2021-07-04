# Express Error Handler

[![npm version](https://badge.fury.io/js/%40sintese%2Fexpress-error-handler.svg)](https://badge.fury.io/js/%40sintese%2Fexpress-error-handler)
[![Software License][ico-license]](LICENSE.md)

Middleware para captura e tratamento de erros para expressjs

## Instalando

Via npm

``` bash
$ npm i @sintese/express-error-handler
```

## Usando

``` nodejs
const express = require('express')
const error = require('@sintese/express-error-handler')

const app = express()
// especificação de rotas
app.use(error())
```

## Change log

Modificações recentes são registradas no [CHANGELOG](CHANGELOG.md)

## Contribuindo

Dúvidas, contribuições e sugestões são muito bem vidas.

## Créditos

- [Rafael Becker][link-author]

## Licença

Esse pacote é disponibilizado sob a licença [MIT](LICENSE.md).

[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[link-author]: https://github.com/rafaelbeecker