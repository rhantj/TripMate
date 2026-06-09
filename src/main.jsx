// 제일 먼저 실행되는 파일 = 프로그램 시작점

import { StrictMode } from 'react' // React 검사기 
import { createRoot } from 'react-dom/client' // React 화면을 브라우저에 그려주는 기능
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
