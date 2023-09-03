import axios from "axios";
import { useEffect, useState } from "react";
import {BsChatText} from 'react-icons/bs';
import {AiOutlineLike} from 'react-icons/ai';
import { Routes, Route, useNavigate } from "react-router-dom";
import BoardDetail from "./board/boardDetail";

function Home(props){

  const navigate = useNavigate();
  let token = props.token;
  let [recentList, setRecnetList] = useState([]);
  let [popularList, setPopularList] = useState([]);

  useEffect(() => {
    axios.get('/api/home', {
      headers: {Authorization: token} /* 헤더에 토큰 담아서 보내기 */
    })
    .then((res) => {
      //console.log(res);
      setRecnetList(res.data[0].posts);
      setPopularList(res.data[1].posts);
    })
    .catch(() => {
      console.log('err');
    })
  }, []);

  //console.log(recentList);
  //console.log(popularList);

    return(
        <>
          <div className='body'>
            <div className='body-left'>
              <div className='recent' >
                <BsChatText />
                <h2>최신글</h2>
                <hr></hr>
                {recentList.length !== 0 ? 
                <>
                {recentList.map((data, i) => {
                  return(
                    <div className="recentList" key={i} onClick={e => {
                      navigate(`articles/${data.post_id}`)
                    }}>
                      <li>{data.post_title}</li>
                    </div>
                  )
                })}
                </> : null}
              </div>
            </div>
            <div className='body-right'>
              <div className='popular'>
                <AiOutlineLike />
                <h2>인기글</h2>
                <hr></hr>
                {popularList.length !== 0 ? 
                <>
                {popularList.map((data, i) => {
                  return(
                    <div className="popularList" key={i} onClick={e => {
                      navigate(`/articles/${data.post_id}`)
                    }}>
                      <li>{data.post_title}</li>
                      <AiOutlineLike />
                      <div className="like_counts">{data.likes_count}</div>
                    </div>
                  )
                })}
                </> : null}
              </div>
              {/* <div className='info-box'>
              <div className='info'>
                <h2>상담(고민, 연애...)</h2>
              </div>
              <div className='empty'></div>
              <div className='info'>
                <h2>심심풀이</h2>
              </div>
              </div> */}
              </div>
              </div>
              <div className='footer'>
              <div className='footer-info'>
                <p>Copyright © 2023 KNoo. All rights Reserved.</p>
                <p>개발자 : 지찬우, 조성훈</p>
              </div>
          </div>
          <Routes>
            <Route path='/articles/:postId/*' element={<BoardDetail token={token} />} />
          </Routes>
      </>
    )
}

export default Home;