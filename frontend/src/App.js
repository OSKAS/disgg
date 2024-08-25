import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header className="App-header">
        <div className="App-banner">
          <h1 className="App-title">협곡</h1>
          <nav className="App-nav">
            <Link to="/" className="App-nav-link">홈</Link>
            <Link to="/write" className="App-nav-link">글쓰기</Link>
            {loggedIn ? (
              <>
                <button onClick={handleLogout} className="App-btn">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" className="App-nav-link">로그인</Link>
                <Link to="/register" className="App-nav-link">회원가입</Link>
              </>
            )}
            <button onClick={toggleDarkMode} className="App-btn">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<PostForm />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('게시물 로딩 오류:', error));
  }, []);

  return (
    <div className="Home">
      <div className="Post-list">
        {posts.length ? (
          posts.map(post => (
            <div key={post._id} className="Post-item">
              <Link to={`/posts/${post._id}`} className="Post-link">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>— {post.createdBy.username}</small>
              </Link>
            </div>
          ))
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

function PostForm() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('fontSize', fontSize);
    formData.append('fontFamily', fontFamily);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);

    fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(() => {
        setTitle('');
        setContent('');
        setImage(null);
        setVideo(null);
        alert('게시물이 성공적으로 작성되었습니다.');
      })
      .catch(error => console.error('게시물 작성 오류:', error));
  };

  return (
    <div className="Post-form">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ fontSize, fontFamily }}
        />
        <div>
          <label>글꼴:</label>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Nanum Gothic">Nanum Gothic</option>
          </select>
        </div>
        <div>
          <label>글씨 크기:</label>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="14px">작은 글씨</option>
            <option value="16px">보통 글씨</option>
            <option value="18px">큰 글씨</option>
            <option value="20px">매우 큰 글씨</option>
          </select>
        </div>
        <div>
          <label>사진:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div>
          <label>영상:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        <button type="submit">작성</button>
      </form>
    </div>
  );
}

function Login({ setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setLoggedIn(true);
          navigate('/');
        } else {
          alert('로그인 실패: 잘못된 사용자 이름이나 비밀번호입니다.');
        }
      })
      .catch(error => {
        console.error('로그인 오류:', error);
        alert('로그인 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="Auth-form">
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="사용자 이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="Auth-form">
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="사용자 이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>회원가입</button>
    </div>
  );
}

function PostDetail() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error('게시물 상세 로딩 오류:', error));
  }, [id]);

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="Post-detail">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.image && <img src={`http://localhost:5000/uploads/${post.image}`} alt="게시물 이미지" />}
      {post.video && <video controls src={`http://localhost:5000/uploads/${post.video}`}></video>}
      <small>작성자: {post.createdBy.username}</small>
    </div>
  );
}

export default App;
