import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../category-css/board/boardForm.css'

function BoardForm(props){
    let navigate = useNavigate();
    //console.log(props.cookies.token)
    let token = props.cookies.token;
    let [data, setData] = useState({
        post_title: "",
        post_content: "",
        post_category: localStorage.getItem('pathBoardTitle'),
        anonymous: false
    })
    return(
        <div>
        <h2>{localStorage.getItem('boardTitle')} 게시판</h2>
        <form className='boardForm' onSubmit={(e) => {
            console.log(data)
            e.preventDefault();
            console.log('post', token)
            axios.post('/api/v1/posts', data,            // 게시글 데이터 형식에 맞게 보내기
            {
                headers: { Authorization : token}        /* 인증 위해 헤더에 토큰 담아서 보내기 */
            }
            )
            .then((res)=>{
                navigate(`/${data.post_category}_board`);
                window.location.reload();                                   // 나중에 바꾸기 강제 리로드 말고 다른걸로
            }).catch(res => {
                alert(res.response.data.message)                            //실패시 받아온 data에서 message 보여쥬기
            });
        }
        } >
            <input type='text' placeholder="제목을 입력해주세요." value={data.post_title} onChange={(e) => {
                setData({
                ...data,
                post_title: e.target.value
            })}} />
            <br/>
            <textarea placeholder="내용을 입력해주세요." value={data.post_content} onKeyDown={(e) => {
                if(e.key === 'Enter'){
                    setData(...data + <br></br>)
                }                
            }} onChange={e => {setData({
                ...data,
                post_content: e.target.value
            })}} />
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
            <button type='submit'>완료</button>
            </div>
            
        </form>
        </div>
    )
}

export default BoardForm;