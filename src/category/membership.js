import '../category-css/membership.css'
import '../text.css'
import { useState } from 'react';
import axios from 'axios'

function Membership(){
    let [data, setData] = useState({
        username: '',
        password : '',
        passwordCheck: '',
        name : '',
        email : ''
    })
    let [pwCheck, setPwCheck] = useState();

    return(
        <div className='membership-form'>
            <form className='form-box' /* action='요청할 url' method='post' */ >
                <div className='input-box'>
                    <input className='input-text' type='text' placeholder='아이디(4~20)'
                        value={data.username} onChange={e => {setData((data) => ({
                            ...data,
                            username : e.target.value
                        }))}} />
                    <input className='input-text' type='password' placeholder='비밀번호(6~20)'
                        value={data.password} onChange={e => {setData((data) => ({
                            ...data,
                            password : e.target.value
                        }))}} />
                        <input className='input-text' type='password' placeholder='비밀번호 확인' />

                    <input className='input-text' type='text' placeholder='닉네임(2~10)' 
                        value={data.name} onChange={e => {setData((data) => ({
                            ...data,
                            name : e.target.value
                        }))}} />
                    <div className='mail-confirm'>
                        <div className='mail-title'>메일 인증</div>
                        <div className='input-email'>
                            <div className='email-box'><input type='text' placeholder='이메일'
                                value={data.email} onChange={e => {setData((data) => ({
                                    ...data,
                                    email : e.target.value
                                }))}} /><p>@smail.kongju.ac.kr</p></div>
                        </div>
                    </div>
                    <button className='complete' onClick={(e) => {
                        e.preventDefault();
                        //console.log(data)
                        axios.post('/api/v1/auth/sign-up', data)
                        .then(res => console.log(res))
                        .catch(console.log('err'))
                    }} >가입 완료</button>
                </div>
            </form>
        </div>
    )
}

export default Membership;