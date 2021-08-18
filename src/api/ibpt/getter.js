const getterGateway = require('./getterGateway')

module.exports = app => {
    const gateway = getterGateway(app)

    const get = async (req, res) => {
        if (!validateParams(req, res)) {
            return false;
        }
        
        const uf = req.body.uf
        const ncmCollection = req.body.ncm.map((ncm) => ({ codigo: ncm.codigo, excecaoFiscal: ncm.excecaoFiscal }))
        const ultimaVersao = req.body.ultimaVersao

        const ibptFromDatabase = await gateway.getAllIbpt({ uf, ncmCollection, ultimaVersao })
        const ncmResponseCollection = ibptFromDatabase

        const notStoredNcm = filterNotStoredNcm(uf, ncmCollection, ibptFromDatabase)

        for (const ncm of notStoredNcm) {
            const filters = {
                uf,
                codigo: ncm.codigo,
                ex: ncm.excecaoFiscal
            }

            const ibpt = await getProductIbpt(filters)
            if (!ibpt) {
                continue 
            }

            ncmResponseCollection.push(ibpt)
        }

        res.json({
            ibpt: ncmResponseCollection
        })
    }

    const getProductIbpt = async (params) => {
        const ibptFromDb = await gateway.get(params);
        if (ibptFromDb) {
            return ibptFromDb;
        }

        try {
            const ibptFromService = await getFromService(params);
            if (!ibptFromService) {
                return null
            }

            const entity = parseToEntity(ibptFromService);

            const result = await gateway.save(entity);

            return entity
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const getFromService = async (params) => {
        try {
            const response = await app.services.deOlhoNoImposto.getProduct({
                ...params
            })

            const ibptNotFound = !response.data.Codigo
            if (ibptNotFound) {
                return null
            }

            return response.data
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

    const validateParams = (req, res) => {
        if (!req.body) {
            res.status(422).send('request body is required')
            return false
        }

        if (!req.body.uf) {
            res.status(422).send('uf is required')
            return false
        }

        if (!(req.body.ncm && req.body.ncm.length)) {
            res.status(422).send('ncm cannot be empty')
            return false
        }

        const maxNcm = process.env.PARAM_NCM_MAX_LENGTH;
        if (req.body.ncm.length > maxNcm) {
            res.status(422).send(`ncm collection cannot be greater than ${maxNcm}`)
            return false
        }

        return true;
    }

    const ncmHasIbpt = (ncm, uf, storedIbpt) => {
        const hasIbpt =  storedIbpt.some(ibpt => {
            return (
            ncm.codigo == ibpt.codigo &&
            uf == ibpt.uf &&
            ncm.excecaoFiscal == ibpt.excecaoFiscal
        )})

        return hasIbpt
    }

    const filterNotStoredNcm = (uf, ncmCollection, ibptFromDatabase) => {
        return ncmCollection.filter(ncm => !ncmHasIbpt(ncm, uf, ibptFromDatabase))
    }

    return { get }
}