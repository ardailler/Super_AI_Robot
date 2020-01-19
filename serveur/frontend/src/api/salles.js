export default {
    getAll(axios) {
        return axios.get('salles/')
    }/*,
    getById(axios, id) {
        return axios.get(`jef5/action/${id}`);
    },
    create(axios, data) {
        return axios.post('jef5/action/add', data);
    }*/
};
