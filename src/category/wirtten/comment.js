import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import '../../category-css/written/comment.css'

function Comment(props){

    let [commentList, setCommentList] = useState([])
    useEffect(() => {
        axios.get('/api/v1/users', {
            headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
            console.log(res.data)
            setCommentList(res.data.comment_posts)
          })
          .catch(/* console.log('err') */)
    }, [])
    return(
        <div className="written_comment_list">
        {commentList.map((a,i) => {
            return(
                <div onClick={() => {localStorage.setItem('pathBoardTitle', a.post_category)}}>
                    <Link to={`../../${a.post_category}_board/detail/${a.post_id}`} key={i}>
                        <div className="written_content">
                            <p>{a.post_title}</p>
                        </div>
                    </Link>
                </div>
            )
        })}
        <button>더보기</button>
        </div>
    )
}

export default Comment;