module.exports = app => {
    app.route('/ibpt')
        .get(app.api.ibpt.getter.get)
}