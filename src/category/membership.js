import '../category-css/membership.css'
import '../text.css'
import { useState } from 'react';
import axios from 'axios'

function Membership(){
    let [data, setData] = useState({
        id: '',
        password : '',
        nickname : '',
        email : ''
    })
    let [num, setNum] = useState();

    return(
        <div className='membership-form'>
            <form className='form-box' /* action='요청할 url' method='post' */ >
                <div className='input-box'>
                    <input className='input-text' type='text' placeholder='아이디'
                        value={data.id} onChange={e => {setData((data) => ({
                            ...data,
                            id : e.target.value
                        }))}} />
                    <input className='input-text' type='password' placeholder='비밀번호'
                        value={data.password} onChange={e => {setData((data) => ({
                            ...data,
                            password : e.target.value
                        }))}} />
                    <input className='input-text' type='text' placeholder='닉네임' 
                        value={data.nickname} onChange={e => {setData((data) => ({
                            ...data,
                            nickname : e.target.value
                        }))}} />
                    <div className='mail-confirm'>
                        <div className='mail-title'>메일 인증</div>
                        <div className='input-email'>
                            <div className='email-box'><input type='text' placeholder='이메일'
                                value={data.email} onChange={e => {setData((data) => ({
                                    ...data,
                                    email : e.target.value
                                }))}} /><p>@kongju.ac.kr</p></div>
                            <button className='confirm-num'>인증번호 전송</button>
                        </div>
                    </div>
                    <div className='confirm-box'>
                        <input className='input-text' type='text' placeholder='인증번호'
                            value={num} onChange={e => {setNum(e.target.value)}} />
                        <button >인증</button>
                    </div>
                    <button className='complete' onClick={(e) => {
                        e.preventDefault();
                        //console.log(data)
                        axios.post('/auth/sign-up', data)
                        .then(res => console.log(res))
                        .catch(console.log('err'))
                    }} >가입 완료</button>
                </div>
            </form>
        </div>
    )
}

export default Membership;