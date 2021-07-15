const gateway = require('./getterGateway')()

module.exports = app => {
    const get = async (req, res) => {
        validateParams(req, res);
        
        const uf = req.body.uf
        const ncmCollection = req.body.ncm.map((ncm) => ({ codigo: ncm.codigo, excecaoFiscal: ncm.excecaoFiscal }))
        const ultimaVersao = req.body.ultimaVersao

        const ibptFromDatabase = await gateway.fetchAllIbptFromDatabase({ uf, ncmCollection, ultimaVersao })
        res.json({ibpt: ibptFromDatabase});
        
        const ncmResponseCollection =  [];
        
        console.log(ncmCollection.forEach(async ncm => {
            const filters = {
                uf,
                codigo: ncm.codigo,
                ex: ncm.ex
            }

            const ibpt = await getProductIbpt(filters)
            if (ibpt) {
                ncmResponseCollection.push(ibpt)
                console.log('eee', ncmResponseCollection.length)
            }
            console.log('a')

            return ibpt;
        }))        
    }

    const getProductIbpt = async (params) => {
        const ibptFromDb = await getFromDatabase(params);
        if (ibptFromDb) {
            return ibptFromDb;
        }

        try {
            const ibptFromService = await getFromService(params);
            const entity = parseToEntity(ibptFromService.data);

            const result = await save(entity);

            return entity
        } catch (error) {
            return null
        }
    }

    const fetchAllFromDatabase = async (params) => {
        const currentDate = moment().endOf('day').toDate()
        try {
            const data = await app.db('ibpt')
                .where({uf: params.codigo})
                .where(currentDate, 'BETWEEN', 'vigenciaInicio AND vigenciaFinal')
                .where('versao', '!=', params.ultimaVersao)
                .andWhere((builder) => {
                    params.ncmCollection.forEach((ncm) => {
                        builder.orWhere((builder) => {
                            builder.where({codigo: ncm.codigo})
                                .where({excecaoFiscal: ncm.excecaoFiscal})
                        })
                    })
                })
                .first();

            return data
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    const getFromDatabase = async (params) => {
        try {
            const data = await app.db('ibpt')
                .where({
                    codigo: params.codigo
                })
                .first();

            return data
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    const getFromService = async (params) => {
        try {
            const data = await app.services.deOlhoNoImposto.getProduct(params)

            return data
        } catch (error) {
            return null
        }
    }

    const parseToEntity = (ibptFromService) => {
        try {
            return {
                codigo: ibptFromService.Codigo,
                uf: ibptFromService.UF,
                excecaoFiscal: ibptFromService.EX,
                nacional: ibptFromService.Nacional,
                estadual: ibptFromService.Estadual,
                importado: ibptFromService.Importado,
                municipal: ibptFromService.Municipal,
                tipo: ibptFromService.Tipo,
                vigenciaInicio: ibptFromService.VigenciaInicio,
                vigenciaFim: ibptFromService.VigenciaFim,
                chave: ibptFromService.Chave,
                versao: ibptFromService.Versao,
                fonte: ibptFromService.Fonte,
            }   
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    const save = async (ibpt) => {
        return app.db('ibpt').insert(ibpt)
    }

    const validateParams = (req, res) => {
        if (!req.body.uf) {
            return res.status(422).send('uf is required')
        }

        if (!(req.body.ncm && req.body.ncm.length)) {
            return res.status(422).send('ncm cannot be empty')
        }

        const maxNcm = 100;
        if (req.body.ncm.length > maxNcm) {
            return res.status(422).send(`ncm collection cannot be greater than ${maxNcm}`)
        }

        return true;
    }

    return { get }
}