import { useEffect, useState } from "react";
import { Routes, useNavigate, useParams, Route, Link } from "react-router-dom";
import axios from "axios";
import '../../category-css/board/boardDetail.css';
import ModifyBoardForm from "./modifyBoardForm";
import {AiOutlineLike, AiOutlineComment, AiOutlineStar, AiFillStar} from 'react-icons/ai';

function BoardDetail(props) {
    let token = props.cookies.token;
    //console.log(token);
    let {post_id} = useParams();
    let params = useParams();
    let navigate = useNavigate();
    let category_path = props.category_path
    let [postData, setPostData] = useState({
        post_title:'',
        post_content: "",
        post_date: "",
        writer_name: "",
        comments_count: '',
        likes_count: '',
        is_written_by_user : '' 
    });
    let [dateData, setDateData] = useState({
        year: '',
        month: '',
        day: '',
        hour: '',
        min: ''
    })
    let [commentData, setCommentData] = useState([]);           //댓글 리스트 담을 변수
    let [initialCommentData, setInitialCommentData] = useState([]);                                 // 더보기 누르기 전 보여질 댓글 데이터
    let [moreCommentsClick, setMoreCommentsClick] = useState(2);    // useState는 비동기여서 강제로 값 1말고 2 로 설정
    let [recommentData, setRecommentData] = useState([]);       //대댓글 리스트 담을 변수
    let [comment, setComment] = useState();                     //댓글 value 값
    let [clickId, setClickId] = useState(null);                 //대댓글 해당 Id 판별
    let [recomment, setRecomment] = useState();                 //대댓글 value 값
    let [likeCount, setLikeCount] = useState();                 //좋아요 갯수 담을 변수
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
        axios.post('/api/v1/comments', {                    //post 첫번째 인자 url, 두번째 인자 data(request Body), 세번째 인자 params(key, type, headers ...)
            comment_content: comment
        },
            { headers: {Authorization: token},
            params: {'post_id' : post_id}
        }
            )
        .then((res) => {
            window.location.reload();
        })
        .catch(console.log('err'))
    }
    
    //대댓글 작성 함수
    const writeRecomment = (commentId) => {                 
        axios.post('/api/v1/comments/reply', {
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
        axios.post('/api/v1/posts/likes',{/* body 자리 비워놓기 */}, {
            headers: {Authorization : token},
            params: {
                post_id: postId
            }
        })
        .then((res) => {
            console.log(res);
        })
        .catch(() => {
            console.log('err');
        })
    }
    //스크랩 기능
    const scrap = (postId) => {
        axios.post('/api/v1/posts/scraps', {/* body 자리 비워놓기 */}, {
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

    useEffect(() => {
        let comment = [];
        let recomment = []
        axios.get(`/api/v1/posts/${category_path}/${post_id}`, (
            {
                headers: {Authorization: token} /* 헤더에 토큰 담아서 보내기 */
              }
        ))
        .then((res) => {
            console.log(res)
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
            setPostData(res.data.post)
            
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
    },[post_id])

    //console.log(commentData)
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
    
    //console.log('commentData', commentData)
    //console.log('recommentData', recommentData)
    //console.log('initialCommentData', initialCommentData)
    //console.log('moreCommentsClick', moreCommentsClick)
    console.log(isScrap);
    console.log(scrapCount);
    return(
        <>
        {params['*'] === '' ?                                   // params['*'] 여부에 따라 삼항연산자로 
        <>
        <div className="detail-post">
            <p className="name">{postData.writer_name}</p>
            {postData.is_written_by_user ? 
            <>
            <p className="content_modify" ><Link to='content_modify'>수정</Link></p>
            <p className="content_delete" onClick={() => {
                axios.delete('/api/v1/posts',{
                    headers: { Authorization : token},      /* 인증 위해 헤더에 토큰 담아서 보내기 */
                    params : {
                        'post_id': post_id
                    }
                })
                .then((res) => {
                    navigate(`/${category_path}_board`);
                    //window.location.reload();                   //나중에 바꾸기
                })
                .catch(console.log('err'))
            }} >삭제</p>
            </>
            : null}
            <div style={{clear: 'both'}}></div>
            <p className="title">{postData.post_title}</p>
            <p className="date">{calcullateDate(dateUnit, diffTimeMin)}</p>
            <pre>
            <p className="content">{postData.post_content}</p>
            </pre>
            <div className="icon_box">
                <p className="like" onClick={e => {
                    likePost(post_id);
                    window.location.reload();
                }} ><AiOutlineLike /></p>
                <p className="like_count">{likeCount}</p>
                <p className="comment"><AiOutlineComment /></p>
                <p className="comment_size">{commentData.length + recommentData.length}</p>             {/* 댓글 + 대댓글 갯수 */}
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
            </div>
        </div>
            {/* 댓글 놓을 자리 */}
            {initialCommentData.map((a, i) => {
                while(a !== undefined){
                    return(
                        <>
                        <div className="detail-comment" key={i} >
                            <p className="name">{a.writer_name}</p>
                            {a.is_written_by_user ? 
                                <>
                                <p className="comment_delete" onClick={() => {
                                    axios.delete('/api/v1/comments',{
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
                            <button className="btn" onClick={() => {
                                if(clickId === null) {
                                    setClickId(a.comment_id);                //clickId 값 받아서 대댓글 작성화면 보여주기
                                } else {
                                    setClickId(null);                        //한번더 누르면 대댓글 작성화면 없어짐
                                }
                            }} >대댓글작성</button>
                            <br style={{clear: 'both'}}></br>                   {/* float 속성 없애주기 */}
                            <p className="date">{a.comment_date}</p>
                            <p className="comment">{a.comment_content}</p>
                            {/* 대댓글 화면 표시 */}
                            {a.comment_id === clickId ?                     //클릭한 댓글의 아이디와 일치하는 댓글에만 대댓글 작성화면 보여주기
                            <div className="write-recomment">
                                <input placeholder="대댓글을 입력해주세요." value={recomment} onChange={(e) => {setRecomment(e.target.value)}} />
                                <button onClick={() => {
                                    writeRecomment(a.comment_id);
                                }}>작성</button>
                            </div> : null}
                            <div className="recomment-list" >
                                {recommentData.map((b, i) => {
                                    if(a.comment_id === b.parent_comment_id){
                                        return(
                                            <div className="content" key={i} >
                                                <p className="date">{b.comment_date}</p>
                                                <p className="content">{b.comment_content}</p>
                                                <p className="name">{b.writer_name}</p>
                                            </div>
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
            {initialCommentData.length === commentData.length  ? 
                null : 
                <button className="more_comments_btn" onClick={e => {
                    //setMoreCommentsClick(moreCommentsClick => moreCommentsClick + 1);
                    getMoreComments(moreCommentsClick, initialCommentData, commentData);
                }}>댓글 더보기</button>
                }
            </>
            }
       
         <div className="write-comment">
            <input placeholder="댓글을 입력하세요" value={comment} onChange={(e) => {setComment(e.target.value)}} /><button onClick={((e) => {
                postComment();          //댓글 post 함수
            })}>댓글 달기</button>
        </div>
        </> : null}
        
        <Routes>
            <Route path="content_modify" element={<ModifyBoardForm cookies={props.cookies} post_id={post_id} title={postData.post_title} content={postData.post_content} 
            category_path={props.category_path}
            />} />
        </Routes>
        </>
    )
}

export default BoardDetail;