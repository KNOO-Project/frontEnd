import {Button} from 'react-bootstrap';
import '../category-css/login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function Login({setIsLogin, setToken}){
    let navigate = useNavigate();
    let [data, setData] = useState({
        username : '',
        password : ''
    })
    let [check, setCheck] = useState(false);
    let [searchId, setSearchId] = useState(false);
    let [searchPw, setSearchPw] = useState(false);
    let [idData, setIdData] = useState({
        email : ''
    })
    let [pwData, setPwData] = useState({
        id : '',
        email : ''
    })
    const [cookies, setCookie, removeCookie] = useCookies(['userinfo']);
    //console.log(check)
    return(
        <div className='login-form'>
            <form className='form-box'>
                    <input type="email" placeholder="ID" value={data.username}
                    onChange={(e) => {setData((data) => ({
                        ...data,
                        username : e.target.value
                    }))}} />
                    <input type="password" placeholder="Password" value={data.password} 
                    onChange={e => {setData((data) => ({
                        ...data,
                        password : e.target.value
                    }))}} />
                <div className='btn'>
                    <Button className='btn-login' variant="info" onClick={(e)=>{
                        e.preventDefault();
                        /* async function(data) {

                        } */
                        axios.post('/api/v1/auth/sign-in', data)
                        .then((res) => {
                            if(res.data.includes('Bearer ')){
                                let token = res.data;
                                setCookie('token', `${token}`);
                                setIsLogin((prev) => !prev)
                                setToken(token);
                                navigate('/');
                                console.log(token)
                            }
                            
                            console.log(res)
                        })
                        .catch((res) => {console.log('err')})
                        }}>Login</Button>
                    <Button className='btn-id' variant="light"
                    onClick={() => {setSearchId((prev) => !prev);
                    if(searchPw){
                        setSearchPw((prev) => !prev)
                    }
                    }} >아이디 찾기</Button>
                    <Button className='btn-pw' variant="light" 
                    onClick={() => {setSearchPw((prev) => !prev)
                    if(searchId){
                        setSearchId(false)
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
                        axios.post('/post', idData)
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
                        axios.post('/post', pwData)
                        .then((res) => {console.log(res)})
                        .catch(console.log('err'))
                    }} >찾기</button>
                </div>
                    </> : null}
                <div className='auto-login'>
                <input type='checkbox' id='자동로그인' onClick={() => {
                    setCheck(prev => !prev)
                }}/>
                <label for='자동로그인' >자동로그인</label>
                </div>
            </form>
        </div>
    )
}

export default Login;