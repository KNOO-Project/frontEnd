import { useEffect, useState } from 'react';
import '../../category-css/login_out/myInfo.css'
import axios from 'axios';
import { Route, Routes, Link } from 'react-router-dom';
import Content from '../wirtten/content';
import Comment from '../wirtten/comment';

function MyInfo(props) {

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
                    userEmail: res.data.name
                }))            
          })
          .catch(/* console.log('err') */)
    }, [])
    

    return(
        <>
        {localStorage.getItem('writtenClick') ?                      //Link 클릭시 'written' 값 true로 저장후 페이지 보여주기
        <>
        <Routes>
            <Route path='written_content_by_me' element={<Content cookies={props.cookies} />} />
            <Route path='written_comment_by_me' element={<Comment cookies={props.cookies} />} />
        </Routes>
        </> : 
        <div className="userInfo">
            <ul>
                <li>닉네임 : {userData.userName}</li>
                <li>email : {userData.userEmail}</li>
            </ul>
            <div className='written'>
                <Link to='written_content_by_me' onClick={(e) => {
                    localStorage.setItem('writtenClick', true)
                }} >내가 쓴 글</Link>
                <br></br>
                <Link to='written_comment_by_me' onClick={(e) => {
                    localStorage.setItem('writtenClick', true)
                }}>댓글 단 글</Link>
            </div>
        </div>
         }
        
        
        </>
    )
}

export default MyInfo;