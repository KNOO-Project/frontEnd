import {Button} from 'react-bootstrap';
import '../../category-css/login_out/login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login({setIsLogin, setCookie}){
    let navigate = useNavigate();
    let [data, setData] = useState({
        username : '',
        password : '',
        auto_sign_in : false
    })
    let [searchId, setSearchId] = useState(false);
    let [searchPw, setSearchPw] = useState(false);
    let [idData, setIdData] = useState({
        email : ''
    })
    let [pwData, setPwData] = useState({    
        id : '',
        email : ''
    })

    const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

    const login = () => {
        axios.post(`${PROXY}/api/auth/sign-in`, data)
        .then((res) => {
            //console.log(res.data)
            console.log(res);
            let token = res.data;
            if(data.auto_sign_in){
                /* 자동 로그인 클릭시 */
                localStorage.setItem('token', token);
                localStorage.setItem('isLogin', true);
            }else {
                /* 자동 로그인 클릭 X */
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('isLogin', true);
            }
            navigate('/');
            window.location.reload();
        })
        .catch((res) => {
            console.log(res);
            alert('아이디 또는 비밀번호가 올바르지 않습니다.')
        })
    }

    const enterKey = (e) => {
        if(e.key === 'Enter')
        login();
    }

    return(
        <div className='login-form'>
            <form className='form-box'>
                    <input type="email" placeholder="ID" value={data.username}
                    onChange={(e) => {setData((data) => ({
                        ...data,
                        username : e.target.value
                    }))}} />
                    <input type="password" placeholder="Password" onKeyDown={enterKey} value={data.password} 
                    onChange={e => {setData((data) => ({
                        ...data,
                        password : e.target.value
                    }))}} />
                <div className='btn'>
                    <Button className='btn-login' variant="info" onClick={(e)=>{
                        //e.preventDefault();
                        login();
                        }}>Login</Button>
                    <Button className='btn-id' variant="light"
                    onClick={() => {setSearchId((prev) => !prev);
                    if(searchPw){
                        setSearchPw((prev) => !prev);
                    }
                    }} >아이디 찾기</Button>
                    <Button className='btn-pw' variant="light" 
                    onClick={() => {setSearchPw((prev) => !prev)
                    if(searchId){
                        setSearchId(false);
                    }
                    }}
                     >비밀번호 찾기</Button>
                </div>
                {searchId ? <>
                <div className='search-id'>
                    <input type='email' placeholder='학교 이메일을 입력해주세요' value={idData.email}
                    onChange={e => {setIdData((idData) => ({
                        ...idData,
                        email : e.target.value
                    }))}} />
                    <button onClick={e => {
                        e.preventDefault();
                        axios.post('/post', idData)                 // 유저가 입력한 email post로 전송
                        .then((res) => {console.log(res)})
                        .catch(console.log('err'))
                    }} >아이디 찾기</button>
                </div>
                </> : null}
                {searchPw ? <>
                <div className='search-pw'>
                    <input type='text' placeholder='아이디를 입력해주세요' value={pwData.id}
                    onChange={e => {setPwData((pwData) => ({
                        ...pwData,
                        id : e.target.value
                    }))}} />
                    <input type='email' placeholder='이메일을 입력해주세요' value={pwData.email}
                    onChange={e => {setPwData((pwData) => ({
                        ...pwData,
                        email : e.target.value
                    }))}} />
                    <br/>
                    <button onClick={e => {
                        e.preventDefault();
                        axios.post('/post', pwData)             //유저가 입력한 아이디, 비밀번호 보내기
                        .then((res) => {console.log(res)})
                        .catch(console.log('err'))
                    }} >찾기</button>
                </div>
                    </> : null}
                <div className='auto-login'>
                <input type='checkbox' id='자동로그인' onClick={() => {setData((data) => ({
                    ...data,
                    auto_sign_in: !data.auto_sign_in
                }))
                }}/>
                <label for='자동로그인' >자동로그인</label>
                </div>
            </form>
        </div>
    )
}

export default Login;