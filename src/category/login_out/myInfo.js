import { useEffect, useState } from 'react';
import '../../category-css/login_out/myInfo.css'
import axios from 'axios';

function MyInfo(props) {
    let [userData, setUserData] = useState({
        userName: '',
        userEmail: ''
    })

    useEffect(() => {
        axios.get('/api/v1/users', {
            headers: {Authorization: props.cookies.token} /* 헤더에 토큰 담아서 보내기 */
          })
          .then(res => {
                setUserData((data) => ({
                    ...data,
                    userName: res.data.name,
                    userEmail: res.data.name
                }))            
          })
          .catch(/* console.log('err') */)
    }, [])
    

    return(
        <div className="userInfo">
            <ul>
                <li>닉네임 : {userData.userName}</li>
                <li>email : {userData.userEmail}</li>
            </ul>
        </div>
    )
}

export default MyInfo;