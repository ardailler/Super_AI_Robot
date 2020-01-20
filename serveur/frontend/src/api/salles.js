export default {
    getAll(axios) {
        return axios.get('salles/')
    },
    create(axios, data) {
        return axios.post('salles/', data);
    },
    getById(axios, id) {
        return axios.get(`salles/${id}`);
    }/*,
    create(axios, data) {
        return axios.post('jef5/action/add', data);
    }*/
};
