import '../../category-css/login_out/myInfo.css'

function MyInfo({userInfo}) {
    return(
        <div className="userInfo">
            <ul>
                <li>닉네임 : {userInfo.name}</li>
                <li>email : {userInfo.email}</li>
            </ul>
        </div>
    )
}

export default MyInfo;