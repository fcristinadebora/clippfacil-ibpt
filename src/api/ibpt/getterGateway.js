const moment = require('moment')

module.exports = app => {
    const currentDate = moment().endOf('day').toDate()

    const getAllIbpt = async ({
        ultimaVersao,
        ncmCollection,
        uf
    }) => {
        try {
            const data = await app.db('ibpt')
                .where({uf: uf})
                .where('vigenciaInicio', '<=', moment().startOf('day').toDate())
                .where('vigenciaFim', '>=', moment().endOf('day').toDate())
                .where('versao', '!=', `${ultimaVersao}`)
                .andWhere((builder) => {
                    ncmCollection.forEach((ncm) => {
                        builder.orWhere((builder) => {
                            builder.where({codigo: ncm.codigo})
                                .where({excecaoFiscal: ncm.excecaoFiscal})
                        })
                    })
                });

            return data
        } catch (error) {
            console.log(3)
            console.error(error)
            return null;
        }
    }

    const get = async (params) => {
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

    const save = async (ibpt) => {
        return app.db('ibpt').insert(ibpt)
    }

    return { getAllIbpt, get, save }
}