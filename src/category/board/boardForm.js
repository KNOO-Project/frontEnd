import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../category-css/board/boardForm.css'

function BoardForm(props){
    let navigate = useNavigate();
    let token = props.cookies.token;
    let [data, setData] = useState({
        post_title: "",
        post_content: "",
        post_category: props.category,
        anonymous: false
    });

    return(
        <div>
        <h2>{localStorage.getItem('boardTitle')} 게시판</h2>
        <form className='boardForm' onSubmit={(e) => {
            /* let postData = data.post_content.split('\n');
            let convertData = [];
            for(var i=0; i<postData.length; i++){
                if(postData[i].length > 48){
                    let count = Math.floor(postData[i].length / 48);
                    for(var j=0; j<count; j++){
                        if((j+1)*48 > postData[i].length){
                            convertData.push(postData[i].slice(j*48, postData[i].length));
                        } else {
                            convertData.push(postData[i].slice(j*48, (j+1)*48));
                        }                        
                    }
                }else {
                    convertData.push(postData[i]);
                }
            }
            setData({
                ...data,
                post_content : convertData
            })
            console.log('postData', postData);
            console.log('convertData', convertData); */
            /* let k = 0;
            while(k === data.post_content.length){
                let array = '';
                for(var i=k; i<k+48; i++){
                    if(data.post_content[k] === '\n'){
                        k = i;
                        break;
                    }
                    array = array + data.post_content[k];
                }
                if(!array.includes('\n')){
                    data.post_content = data.post_content.slice(0, k+48) + '\n' + data.post_content.slice(k+48, data.post_content.length);
                    k += 48;
                }
            } */
            
            console.log(data)
            e.preventDefault();
            console.log('post', token)
            axios.post('/api/v1/posts', data,            // 게시글 데이터 형식에 맞게 보내기
            {
                headers: { Authorization : token}        /* 인증 위해 헤더에 토큰 담아서 보내기 */
            }
            )
            .then((res)=>{
                navigate(`/${props.category}_board`);
                //window.location.reload();                                   // 나중에 바꾸기 강제 리로드 말고 다른걸로
            }).catch(res => {
                alert(res.response.data.message)                            //실패시 받아온 data에서 message 보여쥬기
                console.log(data)
            });
        }
        } >
            <input type='text' placeholder="제목을 입력해주세요." value={data.post_title} onChange={(e) => {
                setData({
                ...data,
                post_title: e.target.value
            })}} />
            <br/>
            <textarea placeholder="내용을 입력해주세요."  value={data.post_content}  onChange={e => {
                setData({
                    ...data,
                    post_content: e.target.value
                })
                /* if(data.post_content.length % 48 === 0 && data.post_content.length !== 0){          //textarea 너비가 48
                    setData({
                        ...data,
                        post_content: e.target.value + '\n'
                    })
                }else {
                    setData({
                        ...data,
                        post_content: e.target.value
                    })
                } */
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
            <button type='submit'>완료</button>
            </div>
            
        </form>
        </div>
    )
}

export default BoardForm;