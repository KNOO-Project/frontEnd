import { useEffect, useState } from "react";
import { Routes, useNavigate, useParams, Route, Link } from "react-router-dom";
import axios from "axios";
import '../../category-css/board/boardDetail.css';
import ModifyBoardForm from "./modifyBoardForm";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import {BiPencil, BiImage} from 'react-icons/bi';
import {MdOutlineSubdirectoryArrowRight} from 'react-icons/md';

function BoardDetail(props) {
    let token = props.token;
    //console.log(token);
    let params = useParams();
    let post_id = params.postId, category = params.category_board.split('_')[0];        //axios 전송 주소 값
    console.log(params);
    console.log(post_id);
    console.log(category);
    let navigate = useNavigate();
    let [postData, setPostData] = useState({
        post_title:'',
        post_content: "",
        post_date: "",
        writer_name: "",
        comments_count: '',
        likes_count: '',
        is_written_by_user : '' 
    });
    let [imgUrl, setImgUrl] = useState([]);
    let [contentData, setContentData] = useState([]);           //줄바꿈 적용해서 contentData에 담기

    let [dateData, setDateData] = useState({
        year: '',
        month: '',
        day: '',
        hour: '',
        min: ''
    });

    let [commentData, setCommentData] = useState([]);           //댓글 리스트 담을 변수
    let [initialCommentData, setInitialCommentData] = useState([]);                                 // 더보기 누르기 전 보여질 댓글 데이터
    let [moreCommentsClick, setMoreCommentsClick] = useState(2);    // useState는 비동기여서 강제로 값 1말고 2 로 설정
    let [recommentData, setRecommentData] = useState([]);       //대댓글 리스트 담을 변수
    let [comment, setComment] = useState('');                     //댓글 value 값
    let [clickId, setClickId] = useState(null);                 //대댓글 해당 Id 판별
    let [recomment, setRecomment] = useState();                 //대댓글 value 값
    let [likeCount, setLikeCount] = useState();                 //좋아요 갯수 담을 변수
    let [likePostClick, setLikePostClick] = useState(false);        //likePostClick 값 변경시 likeCount 값 업데이트되고 useEffect 다시 실행
    let [likeCommentClick, setLikeCommentClick] = useState(false);  //likeCommentClick 값 변경시 likeComment 값 업데이트되고 useEffect 다시 실행
    let [isScrap, setIsScrap] = useState()                      //게시글 스크랩 여부
    let [scrapCount, setScrapCount] = useState();               //게시글 스크랩 횟수
    let currentDate = new Date();
    let currentDateData = {
        year: Number(currentDate.getFullYear()),
        month: Number(currentDate.getMonth() + 1),                         //1~12월이 아니라 0~11월까지기 때문에 1을 더해줌
        day: Number(currentDate.getDate()),
        hour: Number(currentDate.getHours()),
        min: Number(currentDate.getMinutes())
    }
    
    
    //댓글 작성 함수
    const postComment = () => {
        axios.post('/api/comments', {                    //post 첫번째 인자 url, 두번째 인자 data(request Body), 세번째 인자 params(key, type, headers ...)
            comment_content: comment
        },
            { headers: {Authorization: token},
            params: {'post_id' : post_id}
        }
            )
        .then((res) => {
            window.location.reload();
        })
        .catch((res) => {
            alert(res.response.data.message);
        });
    }
    
    //대댓글 작성 함수
    const writeRecomment = (commentId) => {                 
        axios.post('/api/comments/reply', {
            comment_content: recomment
        }, 
        {
            headers: {Authorization : token},
            params: {
                comment_id: commentId
            }
        })
        .then((res) => {
            window.location.reload();
        })
        .catch((res) => {console.log(res)})
    }

    //좋아요 기능
    const likePost = (postId) => {                  
        axios.post('/api/posts/likes',{/* body 자리 비워놓기 */}, {
            headers: {Authorization : token},
            params: {
                post_id: postId
            }
        })
        .then((res) => {
            console.log(res);
            setLikePostClick(prev => !prev);
        })
        .catch(() => {
            console.log('err');
        })
    }

    const likeComment = (commentId) => {
        axios.post('/api/comments/likes', {/* body 자리 비워놓기 */}, {
            headers: {Authorization: token},
            params: {
                comment_id: commentId
            }
        })
        .then((res) => {
            console.log(res);
            setLikeCommentClick(prev => !prev);
        })
        .catch(() => {
            console.log('err');
        })
    }
    //스크랩 기능
    const scrap = (postId) => {
        axios.post('/api/posts/scraps', {/* body 자리 비워놓기 */}, {
            headers: {Authorization : token},
            params: {
                post_id : postId
            }
        })
        .then((res) => {
            console.log(res);
        })
        .catch(() => {
            console.log('err');
        })
    }

    const deletePost = (postId) => {
        axios.delete('/api/posts',{
            headers: { Authorization : token},      /* 인증 위해 헤더에 토큰 담아서 보내기 */
            params : {
                post_id : postId
            }
        })
        .then((res) => {
            navigate(`/${category}_board`);
            //window.location.reload();                   //나중에 바꾸기
        })
        .catch(console.log('err'))
    }

    /* 게시글 줄바꿈 함수 */
    const lineBreak = (data, lineLength) => {
        let postData = data.post.post_content.split('\n');
            console.log(postData[0]);
            let convertData = [];
            for(var i=0; i<postData.length; i++){
                if(postData[i].length > lineLength){
                    console.log('postData[i].length', postData[i].length);
                    let count = 0;
                    if(postData[i] % lineLength === 0){
                        count = Math.floor(postData[i].length / lineLength);
                    }else {
                        count = Math.floor(postData[i].length / lineLength) + 1;
                    }
            
                    for(var j=0; j<count; j++){
                        if((j+1)*lineLength > postData[i].length){                                  
                            convertData.push(postData[i].slice(j*lineLength, postData[i].length));
                            console.log(convertData);
                        } else {
                            convertData.push(postData[i].slice(j*lineLength, (j+1)*lineLength));
                            console.log(convertData);
                        }                        
                    }
                    console.log('convertData', convertData);
                }else {
                    convertData.push(postData[i]);
                }
            }
            setContentData(convertData);
    }

    useEffect(() => {
        let comment = [];
        let recomment = []
        axios.get(`/api/posts/${category}/${post_id}` , (
            {
                headers: {Authorization: token} /* 헤더에 토큰 담아서 보내기 */
              }
        ))
        .then((res) => {
            console.log(res);
            setImgUrl(res.data.post.images);
            setLikeCount(res.data.post.likes_count);
            setIsScrap(res.data.post.scrapped);
            setScrapCount(res.data.post.scraps_count);
            let [dateValue, timeValue] = res.data.post.post_date.split(' ');
            let [year, month, day] = dateValue.split('/');
            let [hour, min] = timeValue.split(':');
            setDateData((dateData) => ({
                ...dateData,
                'year': Number(year),
                'month': Number(month),
                'day': Number(day),
                'hour': Number(hour),
                'min': Number(min)
            }))
            setPostData(res.data.post);
            console.log(res.data.post.post_content.length);
            lineBreak(res.data, 89);
            
            for(var i in res.data.comments){
                //console.log(res.data.comments[i])
                if(res.data.comments[i].parent_comment_id === null){
                    comment.push(res.data.comments[i])
                } else {
                    recomment.push(res.data.comments[i])
                }
            }
            setCommentData(comment);
            //console.log(comment);
            setRecommentData(recomment);
            let initialData = [];
            if(res.data.comments.length > 10){
                for(var i=0; i<10; i++){
                    initialData.push(res.data.comments[i]);
                }
                setInitialCommentData(initialData);
            } else {
                for(var j=0; j<res.data.comments.length; j++){
                    initialData.push(res.data.comments[j]);
                }
                setInitialCommentData(initialData);
            }
            
        })
        .catch((res) => {console.log(res)})
    },[post_id, likePostClick, likeCommentClick]);

    //console.log('contentData', contentData[0].length, contentData[1].length);
    //console.log(commentData)
    console.log(postData);
    let diffTime = {
        year: currentDateData.year - dateData.year,
        month: currentDateData.month - dateData.month,
        day: currentDateData.day - dateData.day,
        hour: currentDateData.hour - dateData.hour,
        min: currentDateData.min - dateData.min
    }
    let diffTimeMin = diffTime.min                                                          //시간 계산 두번째 인자
    let dateUnit = {                                                                        //보여줄 시간 단위
        year: '년전',
        month: '달전',
        day: '일전',
        hour: '시간전',
        min: '분전'
    }
    const calcullateDate = (dateUnit, diffTimeMin) => {                                     //시간계산 함수 시간 이내면 분단위 계산 그외에는 시간, 일, 달, 년으로 계산
        for(var i in diffTime){
            if(diffTime[i] !== 0){
                if(i === 'hour' && diffTime[i] === 1 && diffTimeMin < 0){
                    return (diffTimeMin + 60) +'분전'                                       //-분이면 +60 더해주면 됨
                }
                if(i === 'min' && diffTime[i] < 10){
                    return '방금';
                }
                return  diffTime[i] + dateUnit[i];
            }
        }
    }

    /* 더보기 클릭시 실햄 함수(댓글 더 가져와서 더 보여줌) */
    const getMoreComments = (moreCommentsClick, initialCommentData, commentData) => { 
        //console.log('moreCommentsClick', moreCommentsClick);
        setMoreCommentsClick(prev => prev + 1);
        
        let moreCommentsData = initialCommentData;
        //console.log('moreCommentsClick', moreCommentsClick);
        for(var i=(10 * (moreCommentsClick-1)); i<(10 * moreCommentsClick); i++){
            if(i+1 <= commentData.length){
                moreCommentsData.push(commentData[i]);
            }else {
                break;
            }
            
        }
        setInitialCommentData(moreCommentsData)
    }
    console.log('imgUrl', imgUrl.length);
    //console.log('commentData', commentData)
    //console.log('recommentData', recommentData)
    //console.log('initialCommentData', initialCommentData)
    //console.log('likeCountClick', likePostClick);
    //console.log('moreCommentsClick', moreCommentsClick)
    //console.log(isScrap);
    //console.log(scrapCount);
    //console.log('postData', postData);
    return(
        <>
        {params['*'] === '' ?                                   // params['*'] 여부에 따라 삼항연산자로 
        <>
        <div className="detail-post">
            <p className="name">{postData.writer_name}</p>
            <p className="date">{calcullateDate(dateUnit, diffTimeMin)}</p>
            {postData.is_written_by_user ?                                                 // 글쓴이가 유저이먄 삭제, 수정 버튼 보여주기
            <>
            <p className="content_modify" ><Link to='content_modify'>수정</Link></p>
            <p className="content_delete" onClick={() => {
                if(window.confirm('해당 게시글을 삭제 하시겠습니까?')){
                    deletePost(post_id);
                    //해당 게시글 삭제한다고 서버로 전송
                }else {
                    //그냥 아무일도 일어나지 않음
                }
            }} >삭제</p>
            </>
            : null}
            <div style={{clear: 'both'}}></div>
            <p className="title">{postData.post_title}</p>
            {imgUrl.map((a, i) => {
                return(
                    <>
                    <img src={a} style={{marginBottom: '10px'}} alt="" />
                    <br />
                    </>
                )
            })}
            <p className="content">{contentData.map((a, i) => {
                return(
                    <span>
                        {a}
                        <br/>
                    </span>
                )
            })}</p>
            <div className="icon_box">
                <p className="like" onClick={e => {
                    likePost(post_id);
                }} ><AiOutlineLike /></p>
                <p className="like_count">{likeCount}</p>
                <p className="comment"><AiOutlineComment /></p>
                <p className="comment_count">{commentData.length + recommentData.length}</p>             {/* 댓글 + 대댓글 갯수 */}
                {isScrap ?
                //isScrap == true 
                <p className="scrap" onClick={e => {
                    if(window.confirm('스크랩을 취소하시겠습니까?')){
                        scrap(post_id);
                        window.location.reload();
                        //해당 게시글 스크랩했다고 서버로 전송
                    }else {
                        //그냥 아무일도 일어나지 않음
                    }
                }}><AiFillStar style={{color : '#adb5bd'}} /></p> : 
                //isScrap == false
                <p className="scrap" onClick={e => {
                    if(window.confirm('이 글을 스크랩 하시겠습니까?')){
                        scrap(post_id);
                        window.location.reload();
                        //해당 게시글 스크랩했다고 서버로 전송
                    }else {
                        //그냥 아무일도 일어나지 않음
                    }
                }}><AiOutlineStar /></p>
                }
                <p className="scrap_count">{scrapCount}</p>
                <p className="image"><BiImage /></p>
                <p className="image_count">{imgUrl.length}</p>
            </div>
        </div>
            {/* 댓글 놓을 자리 */}
            {initialCommentData.map((a, i) => {
                if(a.parent_comment_id === null){
                    return(
                        <>
                        <div className="detail-comment" key={i} >
                            <p className="name">{a.writer_name}</p>
                            <p className="date">{a.comment_date}</p>
                            {a.is_written_by_user ? 
                                <>
                                <p className="comment_delete" onClick={() => {
                                    axios.delete('/api/comments',{
                                        headers: { Authorization : token},      /* 인증 위해 헤더에 토큰 담아서 보내기 */
                                        params : {
                                            'comment_id': a.comment_id
                                        }
                                    })
                                    .then((res) => {
                                        alert('댓글이 삭제되었습니다!');
                                        window.location.reload();                  
                                    })
                                    .catch(console.log('err'))
                                }} >삭제</p>
                                </>
                                : null}
                                <div style={{clear: 'both'}}></div>
                            <button className="recomment_btn" onClick={() => {
                                if(clickId === null) {
                                    setClickId(a.comment_id);                //clickId 값 받아서 대댓글 작성화면 보여주기
                                } else {
                                    setClickId(null);                        //한번더 누르면 대댓글 작성화면 없어짐
                                }
                            }} >대댓글작성</button>
                            <br style={{clear: 'both'}}></br>                   {/* float 속성 없애주기 */}
                            
                            <p className="comment">{a.comment_content}</p>
                            <p className="comment_like"><AiOutlineLike onClick={() => {
                                let commentId = a.comment_id;
                                console.log(commentId);
                                likeComment(commentId);
                            }}  /><span className="like_count">{a.likes_count}</span></p>
                            <div style={{clear: 'both'}}></div>
                            {/* 대댓글 화면 표시 */}
                            {a.comment_id === clickId ?                     //클릭한 댓글의 아이디와 일치하는 댓글에만 대댓글 작성화면 보여주기
                            <div className="write-recomment">
                                <textarea placeholder="대댓글을 입력해주세요." value={recomment} onChange={(e) => {setRecomment(e.target.value)}} />
                                <div className="write_recomment_btn">
                                    <BiPencil className="write_recomment_icon" onClick={e => {
                                        writeRecomment(a.comment_id);          //대댓글 작성 함수
                                    }} />
                                </div>
                            </div> : null}
                            <div className="recomment-list" >
                                {recommentData.map((b, i) => {
                                    if(a.comment_id === b.parent_comment_id){
                                        return(
                                            <>
                                            <MdOutlineSubdirectoryArrowRight className="recomment_arrow_icon" />
                                            <div className="content" key={i} >
                                                <p className="date">{b.comment_date}</p>
                                                <p className="content">{b.comment_content}</p>
                                                <p className="name">{b.writer_name}</p>
                                            </div>
                                            <div style={{clear: 'both'}}></div>
                                            </>
                                        )
                                    }
                                })}
                            </div>
                            
                        </div>
                        
                        </>
                    )
                }
                
            })}
            {initialCommentData === [] ? null : 
            <>
            {initialCommentData.length === commentData.length + recommentData.length  ? 
                null : 
                <button className="more_comments_btn" onClick={e => {
                    //setMoreCommentsClick(moreCommentsClick => moreCommentsClick + 1);
                    getMoreComments(moreCommentsClick, initialCommentData, commentData);
                }}>댓글 더보기</button>
                }
            </>
            }
       
         <div className="write-comment">
            <textarea placeholder="댓글을 입력하세요" value={comment} onChange={(e) => {setComment(e.target.value)}} />
            <div className="write_comment_btn">
            <BiPencil className="write_comment_icon" onClick={e => {
                if(comment.length === 0){
                    alert('댓글을 입력해주세요.');
                }else{
                    postComment();          //댓글 작성 함수
                }
            }} />
            </div>
        </div>
        </> : null}
        
        <Routes>
            <Route path="content_modify" element={<ModifyBoardForm token={token} post_id={post_id} title={postData.post_title} content={postData.post_content} 
            category = {category}
            />} />
        </Routes>
        </>
    )
}

export default BoardDetail;