import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ModifyBoardForm(props) {
    let navigate = useNavigate();
    let token = props.cookies.token;
    let [data, setData] = useState({
        post_title: props.title,
        post_content: props.content,
        anonymous: false
    })
    console.log('data.post_content', data.post_content);
    return(
        <>
        <div>
        <h2>{localStorage.getItem('boardTitle')} 게시판</h2>
        <div className='boardForm' >
            <input type='text' placeholder="제목을 입력해주세요." value={data.post_title} onChange={(e) => {
                setData({
                ...data,
                post_title: e.target.value
            })}} />
            <br/>
            <textarea placeholder="내용을 입력해주세요." value={data.post_content} onChange={e => {
                setData({
                    ...data,
                    post_content: e.target.value
                })
            }} />
            <br/>
            <div className='boardForm-btn'>
            <input  type='checkbox' id='anonymous'
            onClick={(e) => {
                if(e.target.checked){
                    setData({
                        ...data,
                        anonymous: true
                    })
                } else {
                    setData({
                        ...data,
                        anonymous: false
                    })
                }
            }} /><label for="anonymous">익명으로 올리기</label>
            <button onClick={() => {
                console.log(data)
                console.log('post', token)
                axios.put('/api/v1/posts', data,            // 게시글 데이터 형식에 맞게 보내기
                {
                    headers: { Authorization : token},      /* 인증 위해 헤더에 토큰 담아서 보내기 */
                    params: {
                        post_id: props.post_id
                    }
                }
                )
                .then((res)=>{
                    navigate(`/${props.category}_board`);
                    //window.location.reload();                                   // 나중에 바꾸기 강제 리로드 말고 다른걸로
                }).catch(res => {
                    alert(res.response.data.message)                            //실패시 받아온 data에서 message 보여쥬기
                });
            }}>완료</button>
            </div>
            
        </div>
        </div>
        </>
    )
}

export default ModifyBoardForm;