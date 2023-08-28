import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './category/home';
import Community from './category/community';
import Future from './category/future';
import Login from './category/login_out/login';
import Membership from './category/membership';
import Map from './category/map/map';
import MainBoard from './category/board/mainBoard';
import MyInfo from './category/myInfo/myInfo';
import CategoryBoard from './category/board/categoryBoard';
import MyScrap from './category/myInfo/myScrap';
import { useEffect, useState } from 'react';
import BoardDetail from './category/board/boardDetail';
import { AiOutlineBell } from 'react-icons/ai';
import axios from 'axios';

function App() {

  let isLogin;
  if(localStorage.getItem('isLogin')){
    /* localStorage 에서 isLogin 가져오기 */
    isLogin = localStorage.getItem('isLogin');
  }else {
    /* sessionStorage 에서 isLogin 가져오기 */
    isLogin = sessionStorage.getItem('isLogin');
  }

  //console.log('isLogin', isLogin);

  let token;
  if(localStorage.getItem('token')){
    /* localStorage 에서 token 가져오기 */
      token = localStorage.getItem('token');
  }else {
    /* sessionStorage 에서 token 가져오기 */
    token = sessionStorage.getItem('token');
  }

  //console.log('token', token);

  let category = ['free', 'newcomer', 'graduate', 'employment', 'student-club', 'info'];
  
  let navigate = useNavigate();
  function moveBoard(pathBoardTitle, boardTitle){                       // categoryBoard 로 넘어가는 함수
    if(isLogin === 'true'){
      localStorage.setItem('categoryBoardClick', true);         //각 카테고리 게시판으로 링크타고 이동하면 true 값 보여주기(각 카테고리별 게시판 글쓰기는 따로)
      localStorage.setItem('pathBoardTitle', pathBoardTitle);    // 페이지 이동시 마다 path가 바뀌어야하기 때문에 각 카테고리로 이동시마다 값 바꿔주기
      localStorage.setItem('boardTitle', boardTitle);             // 카테고리별 게시판 들어가면 title값을 맞게 추가해서 "{title}게시판" 보여주기
      navigate(`${pathBoardTitle}_board`);
      //window.location.reload();         
    } else {
      alert('로그인을 해 주세요!');
      window.location = '/login';
    }
  }

  function moveCategory(path){                        // 해당 카테고리로 페이지 이동
    if(isLogin === 'true'){
      navigate(`/${path}`)
    } else {
      alert('로그인을 해 주세요!');
      window.location = '/login';
    }
  }

  function moveMyInfo(){                              //회원정보조회로 페이지 이동
    navigate('/users');
  }

  let [notifications, setNotifications] = useState([]);
  let [diffTimeValue, setDiffTimeValue] = useState([]);

  let [notificationClick, setNotificationClick] = useState(false);

    useEffect(() => {
      if(isLogin){
        axios.get('/api/notifications', {
          headers: {Authorization: token},
          params: {
            page: 1
          }
        })
        .then((res) => {
          console.log(res);
          let notificationData = [];
          if(res.data.notifications.length > 5){
            for(var i=0; i<5; i++){
              notificationData.push(res.data.notifications[i]);
            }
            setNotifications(notificationData);
          }else {
            setNotifications(res.data.notifications);
          }
          

          let currentDate = new Date();
            //console.log(currentDate)
            let currentDateValue = [
                {min: currentDate.getMinutes()},
                {hour: currentDate.getHours()},
                {day: currentDate.getDate()},
                {month: currentDate.getMonth() + 1},
            ]
            let diffTime = [];
            for(var i=0; i<res.data.notifications.length; i++){
                let writeDate = res.data.notifications[i].notification_date;
                let splitDate = writeDate.split(' ');
                let dateValue = [
                    {min: Number(splitDate[1].split(':')[1])},
                    {hour: Number(splitDate[1].split(':')[0])},
                    {day: Number(splitDate[0].split('/')[2])},
                    {month: Number(splitDate[0].split('/')[1])},
                ]

                if(currentDateValue[3]['month'] - dateValue[3]['month'] !== 0){
                    diffTime.push(Number(currentDateValue[3]['month'] - dateValue[3]['month']) + '달전');
                }else if(currentDateValue[2]['day'] - dateValue[2]['day'] !== 0){
                    if(currentDateValue[2]['day'] - dateValue[2]['day'] < 7){
                        diffTime.push(Number(currentDateValue[2]['day'] - dateValue[2]['day']) + '일전');
                    }else {
                        let week = parseInt(Number(currentDateValue[2]['day'] - dateValue[2]['day']) / 7);
                        diffTime.push(week + '주전');
                    }
                }else if(currentDateValue[1]['hour'] - dateValue[1]['hour'] !== 0){
                    if(currentDateValue[0]['min'] - dateValue[0]['min'] === 1 && (currentDateValue[0]['min'] < dateValue[0]['min'])){
                        diffTime.push(Number(currentDateValue[0]['min'] + 60 - dateValue[0]['min']) + '분전');    
                    }else{
                        diffTime.push(Number(currentDateValue[1]['hour'] - dateValue[1]['hour']) + '시간전');
                    }
                }else if(currentDateValue[0]['min'] - dateValue[0]['min'] !== 0){
                    diffTime.push(Number(currentDateValue[0]['min'] - dateValue[0]['min']) + '분전');
                }

            }

            setDiffTimeValue(diffTime);
        })
        .catch(() => {
          console.log('err')
        })
      }
    }, [])

    console.log(notifications)
    
  

  return (
    <div className="App">
      <div className='nav-bar'>
        <div className='nav-box'>
          <div onClick={()=>{navigate('/')}} className='logo' ><h1 style={{color: '#01A756'}}>KNoo</h1><h6>-beta</h6></div>
          <div className='text-center' >
            <h3 onClick={(e)=>{
              if(isLogin === 'true'){
                //localStorage.removeItem('categoryBoard_click');
                localStorage.setItem('mainBoardClick', true)
                navigate(`/main_board`);
              } else {
                alert('로그인을 해 주세요!');
                window.location = '/login';
              }
              }} >게시판</h3>
              {/* 게시판 hover 시 나타남 */}
              <div className='boardList'>
                <li onClick={(e)=>{
                  moveBoard('free', '자유');
                  }} >자유게시판</li>
                <li onClick={(e)=>{
                  moveBoard('graduate', '졸업생');
                  }} >졸업생게시판</li>
                <li onClick={(e)=>{
                  moveBoard('newcomer', '새내기');
                  }} >새내기게시판</li>
                <li onClick={(e)=>{
                  moveBoard('info', '정보');
                  }} >정보게시판</li>
                <li onClick={(e)=>{
                  moveBoard('employment', '취업&진로');
                  }} >취업.진로</li>
                <li onClick={(e)=>{
                  moveBoard('student-club', '동아리&학회');
                  }} >동아리.학회</li>
              </div>
              {/* 게시판 카테고리 */}
          </div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('맛집');
          }}><h3>맛집</h3>
          </div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('community');
            }}><h3>준비중</h3>
          </div>
          <div className='text-center' onClick={(e)=>{
            moveCategory('진로&취업');
          }
          }><h3>준비중</h3>
          </div>
          {/* 로그인 성공시 창 변경 logout 버튼 생성 */}
          {isLogin ? <>
          <div className='text-right' onClick={() => {
            //setIsLogin(false)
            localStorage.clear();
            sessionStorage.clear();
            navigate('/')
          }} ><h3>로그아웃</h3></div>
          </> : <>
          <div className='text-right' onClick={()=>navigate('/login')}><h3>로그인</h3></div>
          <div className='text-right' onClick={()=>navigate('/회원가입')}><h3>회원가입</h3></div>
          </>}
          {/*로그인 성공시 회원정보 조회 버튼 생성 */}
          {isLogin ? <>
          <div className='text_right_login' style={{textAlign: 'center'}} >
            <h3 onClick={()=>{
            moveMyInfo();
            //localStorage.removeItem('writtenClick', false)                    //마이페이지 클릭하면 myInfo의 false 값만 보여주기
            }} >내 정보</h3>
          </div>
          <div className='alert'>
            {notifications === [] ? null : <div className='notification_alert'></div>}
            <h4><AiOutlineBell onClick={e => {setNotificationClick(prev => !prev)}} /></h4>
            {notificationClick ? 
            <div className='alert_content'>
            <h5>알림</h5>
            {notifications.map((data, i) => {
              console.log(data)
              return(
                <div key={i}>
                  <hr></hr>
                  <li onClick={e => {
                    navigate(`/${data.post_category}_board/detail/${data.post_id}`);
                    setNotificationClick(false);
                  }}>
                    <p>{diffTimeValue[i]}</p>
                    {data.notification_description}
                  </li>
                </div>
              )
            })}
          </div> : null}
          </div>
          </> : null}
        </div>
      </div>
        
      

      <Routes>
        <Route path='/' exact element={
          <Home token={token} />
        } />
        <Route path='/community' element={<Community token={token} />} />
        <Route path='/맛집/*' element={<Map token={token} />} />
        <Route path='/진로&취업' element={<Future />} />
        <Route path='/main_board/*' element={<MainBoard token={token} />} />
        <Route path='/:category_board/*' element={<CategoryBoard token={token} />} />
        <Route path='/articles/:postId/*' element={<BoardDetail token={token} />} />                  {/* 내가 쓴 글 or 댓글 단 글 or 내 스크랩 */}
        <Route path='/login' element={<Login  />} />
        <Route path='/회원가입' element={<Membership />} />
        <Route path='/users/*' exact element={<MyInfo token={token} /> } />
        <Route path='/my_scrap/*' element={<MyScrap token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
