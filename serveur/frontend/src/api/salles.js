export default {
    getAll(axios) {
        return axios.get('salles/')
    },
    create(axios, data) {
        return axios.post('salles/', data);
    },
    getById(axios, id) {
        return axios.get(`salles/${id}`);
    },
    delete(axios, id) {
        return axios.delete(`salles/${id}`);
    }
};
