import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, createStyles } from '@material-ui/core/styles';


import ChatGptApi from './utils/chatGptApi';
import YoutubeApi from './utils/youtubeApi';
import voicevoxApi from './utils/voicevoxApi';

console.log(new Audio())

// フックを作成
const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
    margin: 5,
    // flexBasis: 20
  },
  input: {
    width: 400,
  },
  flexInput: {
    width: '29%'
  },
  flexItemStartBtn: {
    // width: '12.5%'
    width: '200px'
  },
  youtubeUrl: {
    marginTop: 25,
    margin: 5,
  },
  test: {
    width: '600px',
    height: '100px',
    border: '1px solid',
    // overflow: 'scroll',
    overflowY: 'auto',
}
}));

const App = () => {

  const classes = useStyles();

  // メッセージの状態管理用
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeCommentAcquisitionFunc, setYoutubeCommentAcquisitionFunc] = useState('');
  const [youtubeCommentData, setYoutubeCommentData] = useState('');
  const [readingCommentBtnName, setreadingCommentBtnName] = useState("コメント読み取り開始");
  const [readingCommentBtnFlg, setReadingCommentBtnFlg] = useState(false);

  const [lastComent, setLastComent] = useState('');
  const [audioDataList, setAudioDataList] = useState([]);
  const [audiaoCount, setAudioCount] = useState(0);

  // メッセージの格納
  const handleMessageChange = (event) => {
    setYoutubeUrl(event.target.value);
  }

  const readingCommentFunc = async (event) => {

    if (!readingCommentBtnFlg) {
      const LiveUrl = new URL(youtubeUrl);
      const queryParams = new URLSearchParams(LiveUrl.search);
      const liveId = queryParams.get('v')
  
      // youtubeビデオデータ取得
      const liveData = await YoutubeApi.videos(liveId);
  
      if (liveData == null) {
        console.error("ビデオデータ取得できませんでした");
        return;
      }
  
      const channelId = liveData.items[0].liveStreamingDetails.activeLiveChatId;
      console.log(channelId)
  
      setYoutubeCommentAcquisitionFunc(setInterval(async () => {

        const liveCommentData = await YoutubeApi.liveComment(channelId);
  
        if (liveCommentData.status !== null) {
          setYoutubeCommentData(liveCommentData.items);
  
  
          let youubeNewComent = liveCommentData.items.slice(-1)[0].snippet.textMessageDetails.messageText;
          // console.log(newTubeComent);
          // setComent(newTubeComent);
          console.log(youubeNewComent);
          // if (coment !== '') {
  
          if (lastComent !== youubeNewComent) {
            // console.log(youtubeCommentData.slice(-1)[0].snippet.textMessageDetails.messageText);
            //ChatGtp
            const chatGptMsg = await ChatGptApi.completions(youubeNewComent);
  
            //クエリ作成
            console.log(chatGptMsg);
  
            const audioQuery = await voicevoxApi.audioQuery(chatGptMsg);
            // const audioQuery = newQuery;
            // setQueryJson(audioQuery);
  
            // 合成音声　クエリ作成
            const newAudioData = await voicevoxApi.createVoice(audioQuery);
            const audioData = newAudioData;

            let audioList = audioDataList;

            audioList.push(audioData)

            setAudioDataList(audioList);
  
            // }
          }
          setLastComent(youubeNewComent);
        }
        // }
      }, 10000))

      while(audiaoCount !== audioDataList.length) {
        let audioNum = 0;

        if (audiaoCount !== 0) {
          audioNum = audiaoCount - 1
        }

        let audio = new Audio();

        const audioSourceURL = window.URL || window.webkitURL
    
        audio = new Audio(audioSourceURL.createObjectURL(audioDataList));
    
        audio.play();

        while(!audio.ended) {};

        setAudioCount(audioNum + 1);

      }

      setreadingCommentBtnName('コメント読み取り停止')

      // setReading_comment_StopFlg(false);
      setReadingCommentBtnFlg(true);
    } else {
      // // テスト的にChatGPT API組み込んでいる
      // await ChatGptApi.completions("コード修正してください");

      clearInterval(youtubeCommentAcquisitionFunc)

      setreadingCommentBtnName('コメント読み取り開始')

      setReadingCommentBtnFlg(false);
    }

  }

  // チャットフォームの表示
  return (
    <div>
      <h4 className={classes.youtubeUrl}>youtube Live URL</h4>
      <div className={classes.root}>
        <div className={classes.flexInput}>
          <TextField className={classes.input} onChange={handleMessageChange} size="small" id="outlined-basic" label="Youtube URL" variant="outlined" />
        </div>
        <div className={classes.flexItemStartBtn}>
          <Button onClick={readingCommentFunc} size="medium" variant="contained">{readingCommentBtnName}</Button>
        </div>
      </div>
      {/* <div className={classes.test}>
        {youtubeCommentData && (
          youtubeCommentData?.map((data) => (
            <div key={data.id}>{data.snippet.textMessageDetails.messageText}</div>
          ))
        )}
      </div> */}
    </div>
  );
}

export default App;