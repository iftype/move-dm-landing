import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Camera,
  Droplets,
  FileCheck2,
  Home,
  ImageIcon,
  Link2,
  Mic,
  Send,
  Smile,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react'

const checks = [
  { id: 'deposit', icon: WalletCards, label: '보증금 반환', sub: '등기부·반환보증' },
  { id: 'support', icon: Sparkles, label: '이사 지원금', sub: '신청 조건·마감일' },
  { id: 'movein', icon: Home, label: '전입신고', sub: '확정일자·대항력' },
  { id: 'leak', icon: Droplets, label: '누수와 하자', sub: '입주 전 사진 기록' },
  { id: 'contract', icon: FileCheck2, label: '계약서 특약', sub: '위험 문구·필수 특약' },
]

function Bubble({ children, mine = false, wide = false, muted = false }) {
  return (
    <div className={`dm-bubble ${mine ? 'is-mine' : ''} ${wide ? 'is-wide' : ''} ${muted ? 'is-muted' : ''}`}>
      {children}
    </div>
  )
}

function Previous({ mine, children }) {
  return <div className={`previous-line ${mine ? 'is-mine' : ''}`}>{children}</div>
}

function IntroScene({ stage }) {
  return (
    <div className="scene scene-intro">
      {stage >= 1 && <p className="scene-date">8월 2일 오후 9:41</p>}
      {stage === 1 && <div className="typing" aria-label="입력 중"><i /><i /><i /></div>}
      {stage >= 2 && <Bubble>8월에 이사해?</Bubble>}
      {stage >= 3 && <Bubble mine>응, 드디어 집 구했어 😮‍💨</Bubble>}
      {stage === 4 && <div className="typing" aria-label="입력 중"><i /><i /><i /></div>}
      {stage >= 5 && <Bubble>잘 됐다! 그런데 계약 전에<br />꼭 확인할 게 있어.</Bubble>}
    </div>
  )
}

function WaitingScene() {
  return (
    <div className="scene waiting-scene">
      <p className="scene-date">자취선배님이 입력하고 있습니다</p>
      <div className="typing" aria-label="입력 중"><i /><i /><i /></div>
    </div>
  )
}

function DepositScene() {
  return (
    <div className="scene">
      <Bubble wide>집을 구했다고 끝난 게 아니야.</Bubble>
      <Bubble wide>
        <strong>보증금을 돌려받지 못할 가능성은<br />계약 전부터 시작돼.</strong>
      </Bubble>
      <div className="context-line"><span>01</span> 등기부·선순위 보증금·반환보증 확인</div>
      <Bubble mine>그건 아직 확인 못 했어.</Bubble>
    </div>
  )
}

function SupportScene() {
  return (
    <div className="scene">
      <Bubble wide>
        받을 수 있던 <strong>이사비 지원금</strong>도<br />신청일 하루 지나면 끝이고.
      </Bubble>
      <div className="deadline">
        <span>지원금 신청 마감</span>
        <strong>D−1</strong>
      </div>
      <Bubble mine>몰라서 놓치면 너무 아까운데…</Bubble>
    </div>
  )
}

function MoveInScene() {
  return (
    <div className="scene">
      <Bubble wide>
        맞아. 그리고 <strong>전입신고 순서</strong>랑<br />입주 전 <strong>누수 사진</strong>은 확인했어?
      </Bubble>
      <div className="risk-pair">
        <span><Home size={17} /> 내 권리를 지키는 순서</span>
        <span><Droplets size={17} /> 분쟁을 막는 기록</span>
      </div>
      <Bubble mine>…아니, 하나도.</Bubble>
      <Bubble>괜찮아. 지금 같이 보면 돼.</Bubble>
    </div>
  )
}

function ChecklistScene({ selected, onToggle, onReply }) {
  return (
    <div className="scene scene-checklist">
      <Bubble>1분이면 돼. 지금 걱정되는 것만 골라봐.</Bubble>
      <div className="inline-checklist">
        <div className="check-heading">
          <div>
            <span>나의 이사 체크</span>
            <strong>뭐가 가장 걱정돼?</strong>
          </div>
          <b>{String(selected.length).padStart(2, '0')}</b>
        </div>
        <div className="check-options">
          {checks.map((item) => {
            const Icon = item.icon
            const active = selected.includes(item.id)
            return (
              <button
                key={item.id}
                className={active ? 'is-selected' : ''}
                onClick={() => onToggle(item.id)}
                aria-pressed={active}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span><strong>{item.label}</strong><small>{item.sub}</small></span>
                <i><Check size={14} /></i>
              </button>
            )
          })}
        </div>
        <button className="reply-button" disabled={!selected.length} onClick={onReply}>
          이대로 답장 보내기 <span>{selected.length}개 <Send size={16} /></span>
        </button>
      </div>
    </div>
  )
}

function ResultScene({ selected, email, setEmail, done, onSubmit, onOpenIntro }) {
  const labels = checks.filter((item) => selected.includes(item.id)).map((item) => item.label)

  return (
    <div className="scene scene-result">
      <Bubble>좋아. 네가 고른 건</Bubble>
      <div className="result-tags">{labels.map((label) => <span key={label}>#{label}</span>)}</div>
      <Bubble>
        이 항목부터 확인하면 돼.<br />체크리스트와 초기 프로토타입을 보내줄게.
      </Bubble>
      <Bubble mine>써보고 솔직하게 알려줄게!</Bubble>
      <span className="read-mark">읽음</span>

      <button className="link-preview" onClick={onOpenIntro}>
        <span className="link-domain"><Link2 size={13} /> JACHUI-SUNBAE.KR</span>
        <strong>자취선배가 정리한<br />이사 체크리스트</strong>
        <small>서비스가 어떻게 만들어지는지 확인해보세요.</small>
        <i><ArrowRight size={17} /></i>
      </button>

      {done ? (
        <div className="complete-reply">
          <i><Check size={19} /></i>
          <div><strong>답장 완료</strong><span>{email}로 가장 먼저 알려드릴게요.</span></div>
        </div>
      ) : (
        <form className="email-reply" onSubmit={onSubmit}>
          <label htmlFor="email">체크리스트 받을 곳</label>
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
            <button aria-label="체크리스트 신청"><ArrowRight size={20} /></button>
          </div>
          <small>초기 사용 의향과 피드백을 확인한 뒤 본 개발을 시작합니다.</small>
        </form>
      )}
    </div>
  )
}

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
]

function VirtualKeyboard({ onKey, onClose }) {
  return (
    <div className="virtual-keyboard" aria-label="화면 키보드">
      <div className="suggestion-row"><span>체크리스트</span><span>보여줘</span><span>알려줘</span></div>
      {keyboardRows.map((row, index) => (
        <div className="key-row" key={index}>
          {row.map((key) => <button type="button" key={key} className={key === '⇧' || key === '⌫' ? 'key-special' : ''} onClick={() => onKey(key)}>{key}</button>)}
        </div>
      ))}
      <div className="key-row key-row-bottom">
        <button type="button" className="key-wide" onClick={() => onKey('123')}>123</button>
        <button type="button" className="key-space" onClick={() => onKey(' ')}>space</button>
        <button type="button" className="key-wide" onClick={onClose}>return</button>
      </div>
    </div>
  )
}

function SiteIntro({ onClose }) {
  return (
    <div className="site-intro">
      <div className="intro-topbar">
        <button onClick={onClose}><ChevronLeft size={22} /> 대화로 돌아가기</button>
        <span>JACHUI-SUNBAE.KR</span>
        <button aria-label="닫기" onClick={onClose}><X size={20} /></button>
      </div>
      <div className="intro-content">
        <span className="intro-kicker">JACHUI-SUNBAE · 2026</span>
        <h2>계약보다 먼저,<br />확인.</h2>
        <p>보증금부터 지원금, 전입신고와 누수까지.<br />자취 시작 전에 놓치기 쉬운 순간을 대화로 확인합니다.</p>
        <div className="intro-steps">
          <span><b>01</b> 위험 발견</span>
          <span><b>02</b> 1분 체크</span>
          <span><b>03</b> 맞춤 안내</span>
        </div>
        <button className="intro-cta" onClick={onClose}>DM에서 체크리스트 받기 <ArrowRight size={18} /></button>
      </div>
    </div>
  )
}

function App() {
  const chatBodyRef = useRef(null)
  const [journeyPhase, setJourneyPhase] = useState(0)
  const [selected, setSelected] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [introStage, setIntroStage] = useState(0)
  const [phaseReady, setPhaseReady] = useState(true)
  const [message, setMessage] = useState('')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [sentMessages, setSentMessages] = useState([])
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setIntroStage(1), 700),
      setTimeout(() => setIntroStage(2), 1700),
      setTimeout(() => setIntroStage(3), 2800),
      setTimeout(() => setIntroStage(4), 3900),
      setTimeout(() => setIntroStage(5), 4900),
      setTimeout(() => setJourneyPhase(1), 6500),
      setTimeout(() => setJourneyPhase(2), 9200),
      setTimeout(() => setJourneyPhase(3), 11900),
      setTimeout(() => setJourneyPhase(4), 14600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const phase = submitted ? 5 : journeyPhase

  useEffect(() => {
    if (phase === 0) {
      setPhaseReady(true)
      return
    }
    setPhaseReady(false)
    const timer = setTimeout(() => setPhaseReady(true), 650)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [phase, phaseReady, introStage, selected.length, submitted, sentMessages.length, done, keyboardOpen])

  const toggle = (id) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const reply = () => {
    if (!selected.length) return
    setSubmitted(true)
  }

  const signup = (event) => {
    event.preventDefault()
    if (!email.includes('@')) return
    setDone(true)
  }

  const handleKey = (key) => {
    if (key === '⌫') {
      setMessage((current) => current.slice(0, -1))
    } else if (key !== '⇧' && key !== '123') {
      setMessage((current) => `${current}${key}`)
    }
  }

  const sendMessage = (event) => {
    event.preventDefault()
    const value = message.trim()
    if (!value) return
    if (phase < 4) {
      setSentMessages((current) => [...current.slice(-1), value])
    }
    setMessage('')
    closeKeyboard()
  }

  const closeKeyboard = () => {
    setKeyboardOpen(false)
  }

  return (
    <main className="dm-journey">
      <div className={`dm-screen ${keyboardOpen ? 'keyboard-open' : ''}`}>
        <header className="dm-header">
          <ChevronLeft size={24} strokeWidth={1.7} />
          <div className="profile-avatar">선</div>
          <div className="profile-copy">
            <strong>자취선배 <i /></strong>
            <span>온라인</span>
          </div>
          <button className="header-site" onClick={() => setShowIntro(true)}><Link2 size={15} /> 사이트 바로가기</button>
        </header>

        <div className="dm-body" ref={chatBodyRef} aria-live="polite">
          <div className="message-list">
            <IntroScene stage={introStage} />
            {phase > 0 && !phaseReady && <WaitingScene />}
            {phase >= 1 && phaseReady && <DepositScene />}
            {phase >= 2 && phaseReady && <SupportScene />}
            {phase >= 3 && phaseReady && <MoveInScene />}
            {phase >= 4 && phaseReady && <ChecklistScene selected={selected} onToggle={toggle} onReply={reply} />}
            {phase >= 5 && phaseReady && <ResultScene selected={selected} email={email} setEmail={setEmail} done={done} onSubmit={signup} onOpenIntro={() => setShowIntro(true)} />}
            {phase < 4 && sentMessages.length > 0 && (
              <div className="sent-stack">{sentMessages.map((text, index) => <Bubble mine key={`${text}-${index}`}>{text}</Bubble>)}</div>
            )}
          </div>
        </div>

        <div className="chat-footer">
          <form className="chat-composer" onSubmit={sendMessage}>
            <button type="button" className="camera-button" aria-label="카메라"><Camera size={20} /></button>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onFocus={() => setKeyboardOpen(true)}
              inputMode="none"
              placeholder="메시지 보내기..."
              aria-label="메시지"
            />
            {message ? (
              <button className="composer-send" aria-label="메시지 보내기"><Send size={18} /></button>
            ) : (
              <div className="composer-tools"><Mic size={18} /><ImageIcon size={18} /><Smile size={18} /></div>
            )}
          </form>
          {!keyboardOpen && phase < 4 && <div className="auto-message"><i /> 자취선배의 메시지가 이어집니다</div>}
          {keyboardOpen && <VirtualKeyboard onKey={handleKey} onClose={closeKeyboard} />}
          <div className="home-indicator" />
        </div>

        <aside className="desktop-rail rail-left">SCROLL TO REPLY</aside>
        <aside className="desktop-rail rail-right">JACHUI-SUNBAE · 2026</aside>
        {showIntro && <SiteIntro onClose={() => setShowIntro(false)} />}
      </div>
    </main>
  )
}

export default App
