import { useEffect, useRef, useState } from 'react';
import '../../category-css/login_out/myInfo.css'
import axios from 'axios';
import { Route, Routes, Link, useParams } from 'react-router-dom';
import Content from '../wirtten/content';
import Comment from '../wirtten/comment';
import MyScrap from './myScrap';
import AllComments from '../wirtten/writtenDetail/allComments';
import AllContent from '../wirtten/writtenDetail/allContent';

function MyInfo(props) {
    let userInfo = useRef();
    var token = props.token;
    let params = useParams();
    console.log(params['*']);
    let [userData, setUserData] = useState({
        userName: '',
        userEmail: ''
    })

    const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

    useEffect(() => {
        axios.get(`${PROXY}/api/users`, {
            headers: {Authorization: token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
                userInfo(res.data.name);
                setUserData((data) => ({
                    ...data,
                    userName: res.data.name,
                    userEmail: res.data.email
                }))            
          })
          .catch(() => {
            console.log('error');
          })
    }, [])
    
    console.log(userInfo)

    return(
        <>
        {params['*'] === '' ? 
        <>
        <div className="userInfo">
            <ul>
                <li>닉네임 : {userData.userName}</li>
                <li>email : {userData.userEmail}</li>
                <li className='my_scrap_link'><Link to={'../my_scrap'} style={{color: 'black'}}>내 스크랩</Link></li>
            </ul>
            <div className='my_writing'>
                <div className='my_content_writing'>
                <h3>내가 쓴 글</h3>
                <Content token={token} />
                </div>
                <div className='my_comment_writing'>
                <h3>댓글 단 글</h3>
                <Comment token={token} />
                </div>
            </div>
            
            
        </div>
        </>    : null}
        
        <Routes>
            <Route path='../my_scrap' element={<MyScrap token={token} />} />
            <Route path="comments/*" element={<AllComments token={token} />} />
            <Route path='contents/*' element={<AllContent token={token} />} />
        </Routes>
        </>
    )
}

export default MyInfo;