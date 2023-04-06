import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './category/home';
import Community from './category/community';
import Future from './category/future';
import Login from './category/login_out/login';
import Membership from './category/membership';
import Restaurant from './category/restaurant';
import MainBoard from './category/board/mainBoard';
import MyInfo from './category/login_out/myInfo';
import CategoryBoard from './category/board/categoryBoard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  let category = ['free', 'newcomer', 'graduate', 'employment', 'student-club', 'info'];
  /* useEffect(() => {
    if(localStorage.getItem('isLogin')){
      category.map((category_path)=>{
        axios.get(`/api/v1/posts/${category_path}`, {
          headers: {Authorization : cookies.token}
        })
        .then((res)=>{
          localStorage.setItem(`${category_path}_data`, JSON.stringify(res.data))
        })
        .catch((res) => {
          console.log(res)
        })
      })
      
    }
  }) */
  
  let navigate = useNavigate();
  let [onMouse, setOnMouse] = useState(false)
  //let [isLogin, setIsLogin] = useState(false);
  
  
  
  function moveBoard(pathBoardTitle, boardTitle){                       // categoryBoard 로 넘어가는 함수
    if(localStorage.isLogin === 'true'){
      localStorage.setItem('categoryBoardClick', true);         //각 카테고리 게시판으로 링크타고 이동하면 true 값 보여주기(각 카테고리별 게시판 글쓰기는 따로)
      localStorage.setItem('pathBoardTitle', pathBoardTitle);    // 페이지 이동시 마다 path가 바뀌어야하기 때문에 각 카테고리로 이동시마다 값 바꿔주기
      localStorage.setItem('boardTitle', boardTitle);             // 카테고리별 게시판 들어가면 title값을 맞게 추가해서 "{title}게시판" 보여주기
      //window.location.reload();         
    } else {
      alert('로그인을 해 주세요!')
    }
  }

  function moveCategory(path){                        // 해당 카테고리로 페이지 이동
    if(localStorage.isLogin === 'true'){
      navigate(`/${path}`)
    } else {
      alert('로그인을 해 주세요!')
    }
  }

  function moveMyInfo(){                              //회원정보조회로 페이지 이동
    navigate('/myInfo')
            //console.log(cookies.token)
            
  }
  
  return (
    <div className="App">
      <div className='nav-bar'>
        <div className='nav-box'>
          <div onClick={()=>{navigate('/')}}><h1>KNoo</h1></div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('community')
            }}><h3>커뮤니티</h3></div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('맛집')
          }
            }><h3>맛집</h3></div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('진로&취업')
          }
          }><h3>진로.취업</h3></div>
          <div className='text-center' 
          onMouseOver={(e) => {
            e.stopPropagation();
            setOnMouse((prev) => !prev)}}
          onMouseOut={(e) => {
            e.stopPropagation();
            setOnMouse((prev) => !prev)}}
          >
            <h3 onClick={(e)=>{
              if(localStorage.isLogin === 'true'){
                //localStorage.removeItem('categoryBoard_click');
                localStorage.setItem('mainBoardClick', true)
                navigate(`/main_board`);
              } else {
                alert('로그인을 해 주세요!');
              }
              }} >게시판</h3>
              {/* 게시판 카테고리 */}
          {onMouse ? 
                    <>
                    <div className='board-box'>
                    <ul>
                        <li onClick={(e)=>{
                          moveBoard('free', '자유')
                          }} ><Link to={`/main_board/${category[0]}_board`}>자유게시판</Link></li>
                        <li onClick={(e)=>{
                          moveBoard('graduate', '졸업생')
                          }} ><Link to={`/main_board/${category[2]}_board`}>졸업생게시판</Link></li>
                        <li onClick={(e)=>{
                          moveBoard('newcomer', '새내기');
                          }} ><Link to={`/main_board/${category[1]}_board`}>새내기게시판</Link></li>
                        <li onClick={(e)=>{
                          moveBoard('info', '정보');
                          }} ><Link to={`/main_board/${category[5]}_board`}>정보게시판</Link></li>
                        <li onClick={(e)=>{
                          moveBoard('employment', '취업&진로');
                          }} ><Link to={`/main_board/${category[3]}_board`}>취업.진로</Link></li>
                        <li onClick={(e)=>{
                          moveBoard('student-club', '동아리&학회');
                          }} ><Link to={`/main_board/student-club_board`}>동아리.학회</Link></li>
                    </ul>
                    </div>
                    </> 
                    : null}
          </div>
          {/* 로그인 성공시 창 변경 logout 버튼 생성 */}
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
          {/*로그인 성공시 회원정보 조회 버튼 생성 */}
          {localStorage.getItem('isLogin') ? <>
          <div className='text-right' onClick={()=>{
            moveMyInfo();
            }} ><h4>내 정보</h4></div>
          </> : null}
        </div>
      </div>
        
      

      <Routes>
        <Route path='/' element={
          <Home />
        } />
        <Route path='/community' element={<Community />} />
        <Route path='/맛집' element={<Restaurant />} />
        <Route path='/진로&취업' element={<Future />} />
        <Route path='/main_board/*' element={<MainBoard  />} >
          {/* <Route path='free_board/*' element={<CategoryBoard cookies={cookies} category_title={'free'} title={'자유'} boardPage={boardPage} />} />
          <Route path='graduate_board/*' element={<CategoryBoard cookies={cookies} category_title={'graduate'} title={'졸업생'} boardPage={boardPage} />} />
          <Route path='newcomer_board/*' element={<CategoryBoard cookies={cookies} category_title={'newcomer'} title={'새내기'} boardPage={boardPage} />} />
          <Route path='info_board/*' element={<CategoryBoard cookies={cookies} category_title={'info'} title={'정보'} boardPage={boardPage} />} />
          <Route path='employment_board/*' element={<CategoryBoard cookies={cookies} category_title={'employment'} title={'취업&진로'} boardPage={boardPage} />} />
          <Route path='student_club_board/*' element={<CategoryBoard cookies={cookies} category_title={'student-club'} title={'동아리&학회'} boardPage={boardPage} />} /> */}
        </Route>
        <Route path={`/main_board/${localStorage.getItem('pathBoardTitle')}_board/*`} element={<CategoryBoard cookies={cookies} />} />
        <Route path='/login' element={<Login  setCookie={setCookie} />} />
        <Route path='/회원가입' element={<Membership />} />
        <Route path='/myInfo' element={<MyInfo  cookies={cookies} /> } />
      </Routes>
    </div>
  );
}

export default App;
