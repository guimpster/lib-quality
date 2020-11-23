import {
    API_BACKEND
} from '../api';

export default class ConsolidatedService {
    constructor() {
        this.api = API_BACKEND;
    }

    getRepoConsolidated = async repoName => this.api.get(`consolidated?repo=${repoName}`);
}
