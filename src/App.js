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
/* import 동아리 from './category/board/board-sub/동아리';
import 새내기 from './category/board/board-sub/새내기';
import 자유 from './category/board/board-sub/자유';
import 정보 from './category/board/board-sub/정보';
import 졸업생 from './category/board/board-sub/졸업생';
import 취업 from './category/board/board-sub/취업'; */
import { useState } from 'react';
import axios from 'axios';

function App() {
  let navigate = useNavigate();
  let [onMouse, setOnMouse] = useState(false)
  let [isLogin, setIsLogin] = useState(false);
  let [token, setToken] = useState(null)
  let [userInfo, setUserInfo] = useState({
    name: '', 
    email: ''
  })
  let [boardClick, setBoardClick] = useState(null);

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
                          navigate('/board/자유')}} >자유게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/졸업')}} >졸업생게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/새내기')}} >새내기게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/정보')}} >정보게시판</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/취업&진로')}} >취업.진로</li>
                        <li onClick={(e)=>{
                          setBoardClick(true);
                          navigate('/board/동아리&학회')}} >동아리.학회</li>
                    </ul>
                    </div>
                    </> 
                    : null}
          </div>
          {isLogin ? <>
          <div className='text-right' onClick={() => {
            setIsLogin(false)
            navigate('/')
          }} ><h3>Logout</h3></div>
          </> : <>
          <div className='text-right' onClick={()=>navigate('/login')}><h3>login</h3></div>
          <div className='text-right' onClick={()=>navigate('/회원가입')}><h3>회원가입</h3></div>
          </>}
          
          {isLogin ? <>
          <div className='text-right' onClick={()=>{
            navigate('/myInfo')
            console.log(token)
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
              headers: {Authorization: token}
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
          <Route path='자유' element={<BoardForm title={'자유'} />} />
          <Route path='졸업' element={<BoardForm title={'졸업'} />} />
          <Route path='새내기' element={<BoardForm title={'새내기'} />} />
          <Route path='정보' element={<BoardForm title={'정보'} />} />
          <Route path='취업&진로' element={<BoardForm title={'취업&진로'} />} />
          <Route path='동아리&학회' element={<BoardForm title={'동아리&학회'} />} />
        </Route>
        <Route path='/login' element={<Login setIsLogin={setIsLogin} setToken={setToken} />} />
        <Route path='/회원가입' element={<Membership />} />
        <Route path='/myInfo' element={<MyInfo userInfo={userInfo} /> } />
      </Routes>
    </div>
  );
}

export default App;
