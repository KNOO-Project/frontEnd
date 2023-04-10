import { useEffect, useState } from "react"
import axios from "axios"

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
        <>
        {commentList.map((a,i) => {
            return(
                <div>
                    <p>{a.post_title}</p>
                </div>
            )
        })}
        </>
    )
}

export default Comment;