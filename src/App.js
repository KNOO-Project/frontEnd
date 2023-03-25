import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Community from './category/community';
import Future from './category/future';
import Login from './category/login_out/login';
import Membership from './category/membership';
import Restaurant from './category/restaurant';
import Board from './category/board/board';
import MyInfo from './category/login_out/myInfo';
import BoardForm from './category/board/boardForm';
import { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function App() {
  let navigate = useNavigate();
  let [onMouse, setOnMouse] = useState(false)
  //let [isLogin, setIsLogin] = useState(false);
  let [userInfo, setUserInfo] = useState({
    name: '', 
    email: ''
  })
  let [boardClick, setBoardClick] = useState(null);

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  return (
    <div className="App">
      <div className='nav-bar'>
        <div className='nav-box'>
          <div onClick={()=>{navigate('/')}}><h1>KNoo</h1></div>
          <div className='text-center' onClick={(e)=>navigate('/community')}><h3>커뮤니티</h3></div>
          <div className='text-center' onClick={(e)=>navigate('/맛집')}><h3>맛집</h3></div>
          <div className='text-center' onClick={(e)=>navigate('/진로&취업')}><h3>진로.취업</h3></div>
          <div className='text-center' 
          onMouseOver={() => {setOnMouse((prev) => !prev)}}
          onMouseOut={() => {setOnMouse((prev) => !prev)}}
          >
            <h3 onClick={(e)=>{
              setBoardClick(false)
              navigate('/board')}} >게시판</h3>
          {onMouse ? 
                    <>
                    <div className='board-box'>
                    <ul>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/free')}} >자유게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/graduate')}} >졸업생게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/newcomer')}} >새내기게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/info')}} >정보게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/employment')}} >취업.진로</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/student-club')}} >동아리.학회</li>
                    </ul>
                    </div>
                    </> 
                    : null}
          </div>
          {localStorage.getItem('isLogin') ? <>
          <div className='text-right' onClick={() => {
            //setIsLogin(false)
            localStorage.clear();
            removeCookie('token')
            navigate('/')
          }} ><h3>Logout</h3></div>
          </> : <>
          <div className='text-right' onClick={()=>navigate('/login')}><h3>login</h3></div>
          <div className='text-right' onClick={()=>navigate('/회원가입')}><h3>회원가입</h3></div>
          </>}
          
          {localStorage.getItem('isLogin') ? <>
          <div className='text-right' onClick={()=>{
            navigate('/myInfo')
            console.log(cookies.token)
            /* axios({
              method: 'get',
              url: '/api/v1/users',
              headers: {
                Authorization: `Bearer ${token} `
              }
            })
            .then((res) => {console.log(res)}) */
            /* let headers = {
              Authorization: `Bearer ${token}`
            } */
            axios.get('/api/v1/users', {
              headers: {Authorization: cookies.token}
            })
            .then(res => {
              setUserInfo((userInfo) => ({
                ...userInfo,
                name: res.data.name,
                email: res.data.email
              }))
            })
            .catch(console.log('err'))
            }} ><h4>내 정보</h4></div>
          </> : null}
        </div>
      </div>
        
      

      <Routes>
        <Route path='/' element={
          <>
          <div className='body'>
        <div className='body-left'>
          <div className='free'>
            <h2>자유게시판</h2>
          </div>
        </div>
        <div className='body-right'>
          <div className='popular'>
            <h2>인기글</h2>
          </div>
          <div className='info-box'>
          <div className='info'>
            <h2>상담(고민, 연애...)</h2>
          </div>
          <div className='empty'></div>
          <div className='info'>
            <h2>심심풀이</h2>
          </div>
          </div>
        </div>
      </div>
      <div className='footer'>
        <div className='footer-info'>이것저것 소개, 이용문의 등등...</div>
      </div></>
        } />
        <Route path='/community' element={<Community />} />
        <Route path='/맛집' element={<Restaurant />} />
        <Route path='/진로&취업' element={<Future />} />
        <Route path='/board' element={<Board boardClick={boardClick} />} >
          <Route path='free' element={<BoardForm cookies={cookies} title={'free'} />} />
          <Route path='graduate' element={<BoardForm cookies={cookies} title={'graduate'} />} />
          <Route path='fresher' element={<BoardForm cookies={cookies} title={'newcomer'} />} />
          <Route path='info' element={<BoardForm cookies={cookies} title={'info'} />} />
          <Route path='jod&career' element={<BoardForm cookies={cookies} title={'employment'} />} />
          <Route path='club&academy' element={<BoardForm cookies={cookies} title={'student-club'} />} />
        </Route>
        <Route path='/login' element={<Login  setCookie={setCookie} />} />
        <Route path='/회원가입' element={<Membership />} />
        <Route path='/myInfo' element={<MyInfo userInfo={userInfo} /> } />
      </Routes>
    </div>
  );
}

export default App;
