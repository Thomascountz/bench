import localforage from 'localforage';

class GithubTokenModel {
    static async getToken() {
        const token = await localforage.getItem('githubToken');
        return token ? token : null;
    }

    static async saveToken(token) {
        await localforage.setItem('githubToken', token);
    }

    static async deleteToken() {
        await localforage.removeItem('githubToken');
    }
}

export default GithubTokenModel;
