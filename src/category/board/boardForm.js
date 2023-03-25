import axios from 'axios';
import { useState } from 'react';
import '../../category-css/board/boardForm.css'

function BoardForm(props){
    //console.log(props.cookies.token)
    let token = props.cookies.token;
    let [data, setData] = useState({
        post_title: "",
        post_content: "",
        post_category: props.title
    })
    
    return(
        <div>
        <h2>{props.title} 게시판</h2>
        <form className='boardForm' onSubmit={(e) => {
            e.preventDefault();
            console.log('post', token)
            axios.post('/api/v1/posts', data,
            {
                headers: { Authorization : token}
            }
            )
            .then((res)=>{
                console.log(res)
            }).catch(console.log('err'));
        }
        } >
            <input type='text' placeholder="제목을 입력해주세요." value={data.post_title} onChange={(e) => {setData({
                ...data,
                post_title: e.target.value
            })}} />
            <br/>
            <textarea placeholder="내용을 입력해주세요." value={data.post_content} onChange={e => {setData({
                ...data,
                post_content: e.target.value
            })}} />
            <br/>
            <button type='submit'>완료</button>
        </form>
        </div>
    )
}

export default BoardForm;