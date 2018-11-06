import '@babel/polyfill'
// https://breezy-football.glitch.me/
import axios from 'axios'

const api = axios.create({
  // 바깥에서 주입해준 환경변수를 사용하는 코드
  // 이 컴퓨터에서만 사용할 환경변수를 설정하기 위해서 .env 파일을 편집하면 된다.
  baseURL: process.env.API_URL.toString()
});
console.log(process.env.API_URL);

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
});

const templates = {
  loginForm: document.querySelector('#login-form').content,
  postList: document.querySelector('#post-list').content,
  postItem: document.querySelector('#post-item').content,
  postForm: document.querySelector('#post-form').content,
  postDetail: document.querySelector('#post-detail').content,
  commentItem: document.querySelector('#comment-item').content,
}

const rootEl = document.querySelector('.root')

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

async function drawLoginForm() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.loginForm, true)

  // 2. 요소 선택
  const formEl = frag.querySelector('.login-form')

  // 3. 필요한 데이터 불러오기 - 필요없음
  // 4. 내용 채우기 - 필요없음
  // 5. 이벤트 리스너 등록하기
  formEl.addEventListener('submit', async e => {
    e.preventDefault()
    const username = e.target.elements.username.value
    const password = e.target.elements.password.value

    const res = await api.post('/users/login', {
      username,
      password
    })

    localStorage.setItem('token', res.data.token)
    drawPostList()
  })

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
}

async function drawPostList() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.postList, true)

  // 2. 요소 선택
  const listEl = frag.querySelector('.post-list');
  // 3. 필요한 데이터 불러오기
  const {data: postList} = await api.get('/posts/?_expand=user');
  // 응답 객체의 data 변수를 postList 변수에 저장
  // const res = await api.get('/posts/?_expand=user');
  // const post = res.data
  console.log(postList);
  // 4. 내용 채우기
  for(const post of postList){
    // 1. 템플릿 복사
    const frag = document.importNode(templates.postItem, true);
    // 2. 요소 선택
    const idEl = frag.querySelector('.id');
    const titleEl = frag.querySelector('.title');
    const authorEl = frag.querySelector('.author');

    // 3. 필요한 데이터 불러오기
    // 4. 내용 채우기
    idEl.textContent = post.id;
    titleEl.textContent = post.title;
    authorEl.textContent = post.user.username;

    // 5. 이벤트 리스너 등록하기
    titleEl.addEventListener('click', (e) => {
      drawPostDetail(post.id);
    });
    // 6. 템플릿을 문서에 삽입
    listEl.appendChild(frag);
  }
  // 5. 이벤트 리스너 등록하기

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
}

async function drawPostDetail(postId) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.postDetail, true);

  // 2. 요소 선택
  const titleEl = frag.querySelector('.title');
  const authorEl = frag.querySelector('.author');
  const bodyEl = frag.querySelector('.body');
  const backButtonEl = frag.querySelector('.back');
  const commentListEl = frag.querySelector('.comment-list');
  const commentFormEl = frag.querySelector('.comment-form');

  // 3. 필요한 데이터 불러오기
  const { data : {title, body, user, comments} } = await api.get('/posts/' + postId, {
    params : {
      _expand: 'user',
      _embed: 'comments'
    }
  });
  // const res = await api.get('/posts/' + postId + '?_expand=user');
  // const data = res.data;
  // const title = data.title;
  // const body = data.body;
  // const user = data.user;
  // const comments = data.comments;

  // 각 댓글 작성자를 가져오기 위한 데이터 요청
  const params = new URLSearchParams();
  comments.forEach(comment => {
    params.append('id',comment.userId)
  });

  const {data: userList} = await api.get('/users', {
    params
  });

  // 4. 내용 채우기
  titleEl.textContent = title;
  authorEl.textContent = user.username;
  bodyEl.textContent = body;

  // 댓글 표시
  for (const commentItem of comments){
    // 1. 템플릿 복사
    const frag = document.importNode(templates.commentItem, true);

    // 2. 요소 선택
    const authorEl = frag.querySelector('.author');
    const bodyEl = frag.querySelector('.body');
    const deleteEl = frag.querySelector('.delete');

    // 3. 필요한 데이터 불러오기

    // 4. 내용 채우기
    bodyEl.textContent = commentItem.body;

    // userList 에서 현재 코멘트아이템의 유저아이디와 똑같은 객체를 찾아서 user에 저장
    const user = userList.find(item => item.id === commentItem.userId);
    authorEl.textContent = user.username;

    // 5. 이벤트 리스너 등록하기
    // 6. 템플릿을 문서에 삽입
    // commentListEl.textContent = '';
    commentListEl.appendChild(frag);
  }
  // 5. 이벤트 리스너 등록하기
  // 뒤로가기 버튼 이벤트 리스너
  backButtonEl.addEventListener('click', (e) => {
    drawPostList();
  });

  // 코멘트 폼 이벤트 리스너
  commentFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = e.target.elements.body.value;
    await api.post(`/posts/${postId}/comments`,{
      body
    });

    drawPostDetail(postId);
  });

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = '';
  rootEl.appendChild(frag);
}

async function drawNewPostForm() {
  // 1. 템플릿 복사
  // 2. 요소 선택
  // 3. 필요한 데이터 불러오기
  // 4. 내용 채우기
  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
}

async function drawEditPostForm(postId) {
  // 1. 템플릿 복사
  // 2. 요소 선택
  // 3. 필요한 데이터 불러오기
  // 4. 내용 채우기
  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
}

// 페이지 로드 시 그릴 화면 설정
if (localStorage.getItem('token')) {
  drawPostList()
} else {
  drawLoginForm()
}
