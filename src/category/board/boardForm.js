import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../category-css/board/boardForm.css'
import {HiPlus} from 'react-icons/hi';
import {GrNext, GrPrevious} from 'react-icons/gr';

function BoardForm(props){
    let navigate = useNavigate();
    let token = props.token;
    let [imgFile, setImgFile] = useState(null);
    let [previewImages, setPreviewImages] = useState([]);
    let [previewImageNum, setPreviewImageNum] = useState(0);
    let [imgBtnCLick, setImgBtnClick] = useState(false);
    let [data, setData] = useState({
        post_title: "",
        post_content: "",
        post_category: props.category,
        anonymous: false
    });
    //const formData = new FormData();
    const postIdFormData = new FormData();
    
    const saveImage = (e) => {
        const imageList = e.target.files;

        let imgUrlList = [...previewImages];

        for(var i=0; i<imageList.length; i++){
            const currentImageUrl = URL.createObjectURL(imageList[i]);
            imgUrlList.push(currentImageUrl);
        }

        setImgFile(imageList);
        setPreviewImages(imgUrlList);
        //formData.append('post_images', file);

        /* for (let key of formData.keys()) {
            console.log('key', key);
          }
          
        // FormData의 value 확인
        for (let value of formData.values()) {
            console.log('value', value);
        } */
        

    }

    //console.log(previewImages);
    console.log(imgFile);
    console.log('preImgNum', previewImageNum);  
    
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
                let postId = res.data;
                postIdFormData.append('post_id', postId);
                console.log('postId', postId);
                if(imgFile.preview_image !== ''){
                    console.log('preImage', imgFile.preview_image);
                    
                    axios.post(`/api/posts/images`, {
                        post_images: imgFile[0]
                    },
                    {
                        headers: { 
                            Authorization: token,
                            'Content-Type': 'multipart/form-data'
                        },
                        params: {
                            post_id: postId
                        }
                    })
                    .then((res) => {
                        console.log('res2', res);
                    })
                    .catch(() => {
                        console.log('error');
                    })
                }

                console.log('res1', res);
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
            <div className='img_box'>
                {previewImageNum !== 0 ? 
                <div className='previous_icon' onClick={e => {
                    setPreviewImageNum(prev => prev - 1);
                }}><GrPrevious /></div> : null }
                   
                <label className='pre_img' for='imgFile'>
                    {imgFile === null ? <HiPlus /> : 
                    previewImages.map((a, i) => {
                        if(previewImageNum === i){
                            return(
                                <img src={a} alt=''  />
                            )
                        }
                    })
                    }
                </label>
                <input type='file' id='imgFile' accept='image/*' onChange={saveImage} multiple />
                {previewImages.length - 1 === previewImageNum ? null : 
                <div className='next_icon' onClick={e => {
                    setPreviewImageNum(prev => prev + 1);
                }}><GrNext /></div>}
            </div> : null }
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