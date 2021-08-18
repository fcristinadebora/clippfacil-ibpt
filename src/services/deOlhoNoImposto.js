require('dotenv/config');
const axios = require('axios')

module.exports = app => {
    const uri = process.env.IBPT_HOST
    const token = process.env.IBPT_TOKEN
    const cnpj = process.env.SOFTWARE_HOUSE_CNPJ
    const timeout = parseInt(process.env.IBPT_TIMEOUT)

    const client = axios.create({
        timeout: timeout,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })

    const get = (endpoint, params) => {
        const parameters = {
            ...params,
            cnpj,
            token
        }

        return client.get(`${uri}${endpoint}`, {
            params: parameters
        })
    }

    const getProduct = (filters) => {
        const endpoint = '/produtos';
        const params = {
          uf: filters.uf,
          ex: filters.ex,
          codigo: filters.codigo,
          descricao: '',
          unidadeMedida: '',
          valor: 1,
          gtin: ''
        }
  
        return get(endpoint, params);
    }

    return { getProduct };
}