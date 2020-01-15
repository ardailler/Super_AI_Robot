module.exports = {

    request: function (req, token) {
        console.log('ddsfdsdsf')
        this.options.http._setHeaders.call(this, req, {Authorization: token});
    },

    response: function (res) {
        var headers = this.options.http._getHeaders.call(this, res),
            token = headers.Authorization || headers.authorization;
        console.log('sdsdsdsddssdsdsd', token)
        console.log('sdsdsdsddssdsdsd', headers)
        console.log('sdsdsdsddssdsdsd', res)

        return token;
    }
};