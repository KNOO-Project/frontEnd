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
        post_content: "",
        post_date: "",
        writer_name: "",
        comments_count: '',
        likes_count: '',
        is_written_by_user : '' 
    });
    let [commentData, setCommentData] = useState([]);
    let [comment, setComment] = useState()

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
    useEffect(() => {
        axios.get(`/api/v1/posts/${category_path}/${post_id}`, (
            {
                headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
              }
        ))
        .then((res) => {
            //console.log(res.data.post)
            setPostData((postData) => ({
                ...postData,
                post_content: res.data.post.post_content,
                post_date: res.data.post.post_date,
                writer_name: res.data.post.writer_name,
                comments_count: res.data.post.comments_count,
                likes_count: res.data.post.likes_count,
                is_written_by_user: res.data.post.is_written_by_user
            }));
            setCommentData(res.data.comments);
        })
        .catch((res) => {console.log(res)})
    },[post_id])

    return(
        <>
        <div className="detail-post">
            <p className="name">{postData.writer_name}</p>
            <p className="date">{postData.post_date}</p>
            <p className="content">{postData.post_content}</p>
        </div>
            {/* 댓글 놓을 자리 */}
            {commentData.map((a, i) => {
                return(
                    <div className="detail-comment">
                        <p className="name">{a.writer_name}</p>
                        <p className="comment">{a.comment_content}</p>
                        <p className="date">{a.comment_date}</p>
                    </div>
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