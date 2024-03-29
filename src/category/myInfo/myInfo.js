import { useEffect, useState } from 'react';
import '../../category-css/login_out/myInfo.css'
import axios from 'axios';
import { Route, Routes, Link, useParams } from 'react-router-dom';
import Content from '../wirtten/content';
import Comment from '../wirtten/comment';
import MyScrap from './myScrap';
import AllComments from '../wirtten/writtenDetail/allComments';
import AllContent from '../wirtten/writtenDetail/allContent';

function MyInfo(props) {
    let cookies = props.cookies;
    let params = useParams();
    console.log(params['*']);
    let [userData, setUserData] = useState({
        userName: '',
        userEmail: ''
    })


    useEffect(() => {
        axios.get('/api/v1/users', {
            headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
                setUserData((data) => ({
                    ...data,
                    userName: res.data.name,
                    userEmail: res.data.email
                }))            
          })
          .catch(/* console.log('err') */)
    }, [])
    

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
                <Content cookies={props.cookies} />
                </div>
                <div className='my_comment_writing'>
                <h3>댓글 단 글</h3>
                <Comment cookies={props.cookies} />
                </div>
            </div>
            
            
        </div>
        </>    : null}
        
        <Routes>
            <Route path='../my_scrap' element={<MyScrap cookies={props.cookies} />} />
            <Route path="comments/*" element={<AllComments cookies={cookies} />} />
            <Route path='contents/*' element={<AllContent cookies={cookies} />} />
        </Routes>
        </>
    )
}

export default MyInfo;