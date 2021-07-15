const moment = require('moment')
const db = require('../../config/db')

module.exports = app => {
    const currentDate = moment().endOf('day').toDate()
    const fetchAllIbptFromDatabase = async ({
        ultimaVersao,
        ncmCollection,
        uf
    }) => {
        try {
            const data = await db('ibpt')
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

    return { fetchAllIbptFromDatabase }
}