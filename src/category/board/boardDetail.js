import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../category-css/board/detail.css'

function BoardDetail(props) {
    let navigate = useNavigate();
    let {post_id} = useParams();
    let category_path = props.category_path
    //let content = localStorage.getItem('content');
    let [postData, setPostData] = useState({
        post_title:'',
        post_content: "",
        post_date: "",
        writer_name: "",
        comments_count: '',
        likes_count: '',
        is_written_by_user : '' 
    });
    let [commentData, setCommentData] = useState([]);       //댓글 리스트 담을 변수
    let [recommentData, setRecommentData] = useState([]);   //대댓글 리스트 담을 변수
    let [comment, setComment] = useState();                 //댓글 value 값
    let [clickId, setClickId] = useState(null);             //대댓글 해당 Id 판별
    let [recomment, setRecomment] = useState();             //대댓글 value 값

    const postComment = () => {
        axios.post('/api/v1/comments', {                    //post 첫번째 인자 url, 두번째 인자 data(request Body), 세번째 인자 params(key, type, headers ...)
            comment_content: comment
        },
            { headers: {Authorization: props.cookies.token},
            params: {'post_id' : post_id}
        }
            )
        .then((res) => {
            window.location.reload();
        })
        .catch(console.log('err'))
    }

    const writeRecomment = (commentId) => {                 //대댓글 작성 함수
        axios.post('/api/v1/comments/reply', {
            comment_content: recomment
        }, 
        {
            headers: {Authorization : props.cookies.token},
            params: {
                comment_id: commentId
            }
        })
        .then((res) => {
            window.location.reload();
        })
        .catch((res) => {console.log(res)})
    }
    useEffect(() => {
        let comment = [];
        let recomment = []
        axios.get(`/api/v1/posts/${category_path}/${post_id}`, (
            {
                headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
              }
        ))
        .then((res) => {
            //console.log(res.data.post)
            setPostData((postData) => ({
                ...postData,
                post_title: res.data.post.post_title,
                post_content: res.data.post.post_content,
                post_date: res.data.post.post_date,
                writer_name: res.data.post.writer_name,
                comments_count: res.data.post.comments_count,
                likes_count: res.data.post.likes_count,
                is_written_by_user: res.data.post.is_written_by_user
            }))
            for(var i in res.data.comments){
                if(res.data.comments[i].parent_comment_id === null){
                    comment.push(res.data.comments[i])
                } else {
                    recomment.push(res.data.comments[i])
                }
            }
            
        })
        .then(
            setCommentData(comment),            //댓글만 담은 data
            setRecommentData(recomment)         //대댓글만 담은 data
        )
        .catch((res) => {console.log(res)})
    },[post_id])
    //console.log(postData)
    //console.log(commentData)
    //console.log(recommentData);

    return(
        <>
        <div className="detail-post">
            <p className="name">{postData.writer_name}</p>
            <p className="title">{postData.post_title}</p>
            <p className="date">{postData.post_date}</p>
            <p className="content">{postData.post_content}</p>
        </div>
            {/* 댓글 놓을 자리 */}
            {commentData.map((a, i) => {
                return(
                    <>
                    <div className="detail-comment" key={i} >
                        <p className="name">{a.writer_name}</p>
                        <button className="btn" onClick={() => {
                            if(clickId === null) {
                                setClickId(a.comment_id)                //clickId 값 받아서 대댓글 작성화면 보여주기
                            } else {
                                setClickId(null)                        //한번더 누르면 대댓글 작성화면 없어짐
                            }
                        }} >대댓글작성</button>
                        <br style={{clear: 'both'}}></br>                   {/* float 속성 없애주기 */}
                        <p className="comment">{a.comment_content}</p>
                        <p className="date">{a.comment_date}</p>
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
                                        <div className="content">
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
            })}
        <div className="write-comment">
            <input placeholder="댓글을 입력하세요" value={comment} onChange={(e) => {setComment(e.target.value)}} /><button onClick={((e) => {
                postComment();          //댓글 post 함수
            })}>댓글 달기</button>
        </div>
        </>
    )
}

export default BoardDetail;