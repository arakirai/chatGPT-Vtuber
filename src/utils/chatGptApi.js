/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';

// 共通処理
const instance = axios.create({
    baseURL: process.env.REACT_APP_CHAT_GPT_BASE_URL,
    // HTTPヘッダー(認証)
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_CHAT_GPT_API_TOKEN}`
    },
    timeout: 30000,
    cors: true,
})


class ChatGptApi {

    // ChatGPTからメッセージを返答API
    async completions(coment) {

        // API リクエスト
        let response = null;

        try {

            const res = await instance.post(`/chat/completions`, {
                model: process.env.REACT_APP_CHAT_GPT_API_MODEL,
                messages: [
                    {
                        'role': 'user',
                        'content': coment,
                    },
                ],
            })


            return res.data.choices[0].message.content;


        } catch (e) {
            console.error(e)
        }

        // return response;
    }

}

export default new ChatGptApi();