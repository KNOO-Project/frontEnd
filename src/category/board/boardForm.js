import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../category-css/board/boardForm.css'
import {HiPlus} from 'react-icons/hi';

function BoardForm(props){
    let navigate = useNavigate();
    let token = props.token;
    let [imgFile, setImgFile] = useState("");
    let [imgBtnCLick, setImgBtnClick] = useState(false);
    let [data, setData] = useState({
        post_title: "",
        post_content: "",
        post_category: props.category,
        anonymous: false
    });
    const setPreviewImg = (event) => {

        var reader = new FileReader();

        reader.onload = function(event) {
            setImgFile(event.target.result);
        };

        reader.readAsDataURL(event.target.files[0]);

    }

    console.log('imgFile', imgFile);

    return(
        <div>
        <h2>{localStorage.getItem('boardTitle')} 게시판</h2>
        <form className='boardForm' onSubmit={(e) => {
            console.log(data)
            e.preventDefault();
            axios.post('/api/posts', data,            // 게시글 데이터 형식에 맞게 보내기
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
            {imgBtnCLick ? 
            <>
            <label className='img_box' htmlFor='imgFile'>
                {imgFile === "" ? <HiPlus /> : 
                <img src={imgFile} alt=''  />
                }
                
            </label>
            <input type='file' id='imgFile' accept='image/*' onChange={setPreviewImg} />
            </> : null }
            
            <br/>
            <textarea placeholder="내용을 입력해주세요."  value={data.post_content}  onChange={e => {
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
            <button type='submit'>완료</button>
            <button type='button' id='imgFile' onClick={e => {
                setImgBtnClick(prev => !prev);
            }} >사진첨부</button>
            <div style={{clear: 'both'}}></div>
            </div>
            
        </form>
        </div>
    )
}

export default BoardForm;