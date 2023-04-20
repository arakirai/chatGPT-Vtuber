import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { makeStyles, createStyles } from '@material-ui/core/styles';


import ChatGptApi from './utils/chatGptApi';
import YoutubeApi from './utils/youtubeApi';

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
    width: '12.5%'
  },
  youtubeUrl: {
    marginTop: 25,
    margin: 5,
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

  // 回答の状態管理用
  const [answer, setAnswer] = useState('');

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
          // let livecommentData = []

          // console.log(liveCommentData)

          // for (let i = 0; i < liveCommentData.items.length; i++) {
          //   if (liveCommentData.items[i].snippet.textMessageDetails.messageText !== undefined) {
          //     livecommentData.push(liveCommentData.items[i])
          //   }
          // }
          setYoutubeCommentData(liveCommentData.items);
        }
      }, 2000))

      setreadingCommentBtnName('コメント読み取り停止')

      // setReading_comment_StopFlg(false);
      setReadingCommentBtnFlg(true);
    } else {
      // テスト的にChatGPT API組み込んでいる
      await ChatGptApi.completions("コード修正してください");

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
      {youtubeCommentData && (
        youtubeCommentData?.map((data) => (
          <div key={data.id}>{data.snippet.textMessageDetails.messageText}</div>
        ))
      )}
      {/* {answer && (
        <div>
          <h2>回答:</h2>
          <p>{answer}</p>
        </div>
      )} */}
    </div>
  );
}

export default App;