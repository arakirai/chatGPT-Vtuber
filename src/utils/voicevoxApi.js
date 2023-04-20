/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';


// 共通処理
const instance = axios.create({
    baseURL: process.env.VOICEVOX_APP_BESS_URL,
    // HTTPヘッダー(認証)
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_CHAT_GPT_API_TOKEN}`
    },
    timeout: 30000,
    cors: true,
})


class VoicevoxAPI {



    // 文字列からQueryを作り出すAPI
    async audioQuery(msg) {

        // API リクエスト

        let response = null;

        try {

            const params = { 'speaker': 1, 'id': liveId, 'text': msg };

            // API リクエスト
            const res = await instance.post(`/audio_query`, { params: params })

            response = res.data

        } catch (e) {
            console.error(e)
        }

        return
    }

    // Queryから合成音声を作り出すAPI
    async createVoice(queryJson) {

        // API リクエスト
        let response = null;

        // 文字列からQueryを作り出す
        try {

            const params = { 'speaker': 1, 'id': liveId, 'text': msg };

            // API リクエスト
            const res = await instance.post(`/synthesis`, { params: params })
            await instance.send(queryJson);
            await instance.send('blob');

            response = res.data

        } catch (e) {
            console.error(e)
        }

        return response
    }

}

export default new VoicevoxAPI();