/* eslint-disable import/no-anonymous-default-export */
// import axios from 'axios';
import superagent from 'superagent';

class VoicevoxAPI {

    // 文字列からQueryを作り出すAPI
    async createQuery(chatGptMsg) {
        const res = await superagent
          .post(`${process.env.VOICEVOX_APP_BESS_URL}/audio_query`)
          .query({ speaker: 1, text: chatGptMsg });
    
        if (!res) return;
    
        return res.body;
    };

  // Queryから合成音声を作り出す
  async createVoice(voiceQuery) {
    const res = await superagent
      .post(`${process.env.VOICEVOX_APP_BESS_URL}/synthesis`)
      .query({ speaker: 1 })
      .send(voiceQuery)
      .responseType('blob');

    if (!res) return;

    return res.body;
  }
}

export default new VoicevoxAPI();