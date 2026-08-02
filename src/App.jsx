import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  ImageIcon,
  Link2,
  Mic,
  Send,
  Smile,
} from 'lucide-react'

const TARGET_SITE_URL = 'https://zaru-landing-1ymxjuovj-mocas-projects-e7b58534.vercel.app/'

const firstChoices = [
  { id: 'soon', label: '응, 다음 달에 이사해', info: <>그럼 계약 전에 <strong>보증금 반환</strong>부터 확인해보자.<br />등기부와 선순위 보증금은 꼭 봐야 해.</> },
  { id: 'signed', label: '이미 계약은 했어', info: <>괜찮아. 지금이라도 <strong>전입신고와 확정일자</strong>를 챙기면<br />내 권리를 지킬 수 있어.</> },
  { id: 'looking', label: '아직 집을 알아보는 중이야', info: <>잘 됐다. 계약 전에 <strong>위험한 집을 거르는 기준</strong>부터<br />알고 보면 선택이 훨씬 쉬워져.</> },
]

const secondChoices = [
  { id: 'deposit', label: '보증금이 제일 걱정돼', info: <>반환보증 가입 가능 여부와 등기부의 선순위 권리를<br />계약서에 사인하기 전에 확인해야 해.</> },
  { id: 'support', label: '받을 수 있는 지원금이 궁금해', info: <>이사비·중개보수 지원은 지역과 조건마다 다르고<br /><strong>신청일 하루</strong>만 지나도 놓칠 수 있어.</> },
  { id: 'leak', label: '누수나 하자가 걱정돼', info: <>입주 직후 사진과 영상을 남겨두면<br />수리 책임을 분명하게 말할 수 있어.</> },
]

function Bubble({ children, mine = false, wide = false }) {
  return <div className={`dm-bubble ${mine ? 'is-mine' : ''} ${wide ? 'is-wide' : ''}`}>{children}</div>
}

function Typing() {
  return <div className="typing" aria-label="입력 중"><i /><i /><i /></div>
}

function ChoiceGroup({ eyebrow, title, choices, selectedId, onSelect }) {
  return (
    <div className="reply-choices">
      <div className="reply-choices-heading">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </div>
      <div className="reply-choice-list">
        {choices.map((choice) => (
          <button
            type="button"
            key={choice.id}
            className={selectedId === choice.id ? 'is-selected' : ''}
            onClick={() => onSelect(choice)}
            disabled={Boolean(selectedId) && selectedId !== choice.id}
          >
            <span>{choice.label}</span>
            <i>{selectedId === choice.id ? <Check size={14} /> : <ArrowRight size={14} />}</i>
          </button>
        ))}
      </div>
    </div>
  )
}

function LinkPreview() {
  return (
    <a className="link-preview" href={TARGET_SITE_URL}>
      <span className="link-domain"><Link2 size={13} /> JACHUI-SUNBAE.KR</span>
      <strong>이 질문을 이어서<br />확인해보기</strong>
      <small>주거지원과 매물 조건을 직접 물어볼 수 있어요.</small>
      <i><ArrowRight size={17} /></i>
    </a>
  )
}

function VirtualKeyboard({ onKey, onClose }) {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ]
  return (
    <div className="virtual-keyboard" aria-label="화면 키보드">
      <div className="suggestion-row"><span>응, 알려줘</span><span>고마워</span><span>확인했어</span></div>
      {rows.map((row, index) => (
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

function App() {
  const chatBodyRef = useRef(null)
  const [introStep, setIntroStep] = useState(0)
  const [firstChoice, setFirstChoice] = useState(null)
  const [secondChoice, setSecondChoice] = useState(null)
  const [known, setKnown] = useState(null)
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState([])
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setIntroStep(1), 650),
      setTimeout(() => setIntroStep(2), 1650),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [introStep, firstChoice, secondChoice, known, sentMessages.length, keyboardOpen])

  const handleKey = (key) => {
    if (key === '⌫') setMessage((current) => current.slice(0, -1))
    else if (key !== '⇧' && key !== '123') setMessage((current) => `${current}${key}`)
  }

  const sendMessage = (event) => {
    event.preventDefault()
    const value = message.trim()
    if (!value) return
    setSentMessages((current) => [...current.slice(-1), value])
    setMessage('')
    setKeyboardOpen(false)
  }

  const first = firstChoice ? firstChoices.find((choice) => choice.id === firstChoice.id) : null
  const second = secondChoice ? secondChoices.find((choice) => choice.id === secondChoice.id) : null

  return (
    <main className="dm-journey">
      <div className={`dm-screen ${keyboardOpen ? 'keyboard-open' : ''}`}>
        <header className="dm-header">
          <ChevronLeft size={24} strokeWidth={1.7} />
          <div className="profile-avatar">선</div>
          <div className="profile-copy"><strong>자취선배 <i /></strong><span>온라인</span></div>
          <a className="header-site" href={TARGET_SITE_URL}><Link2 size={15} /> 사이트 바로가기</a>
        </header>

        <div className="dm-body" ref={chatBodyRef} aria-live="polite">
          <div className="message-list">
            {introStep === 0 && <div className="scene scene-empty" />}
            {introStep === 1 && <div className="scene"><Typing /></div>}
            {introStep >= 2 && (
              <div className="scene scene-intro">
                <p className="scene-date">오늘 오전 9:41</p>
                <Bubble>8월에 이사해?</Bubble>
                <Bubble>계약 전에 두 가지만 같이 확인해도 될까?</Bubble>
                {!firstChoice && <ChoiceGroup eyebrow="첫 번째 질문" title="지금 이사 상황은 어때?" choices={firstChoices} onSelect={setFirstChoice} />}
              </div>
            )}

            {first && (
              <div className="scene">
                <Bubble mine>{first.label}</Bubble>
                <Bubble wide>{first.info}</Bubble>
                <Bubble>그럼 이번엔 이 중에서 골라봐.</Bubble>
                {!secondChoice && <ChoiceGroup eyebrow="두 번째 질문" title="지금 가장 걱정되는 건?" choices={secondChoices} onSelect={setSecondChoice} />}
              </div>
            )}

            {second && (
              <div className="scene">
                <Bubble mine>{second.label}</Bubble>
                <Bubble wide>{second.info}</Bubble>
                <Bubble>이 내용, 알고 있었어?</Bubble>
                {!known && <ChoiceGroup eyebrow="마지막 확인" title="이사 전에 알고 있었어?" choices={[{ id: 'know', label: '알았어', info: '' }, { id: 'didnt-know', label: '몰랐어', info: '' }]} onSelect={setKnown} />}
              </div>
            )}

            {known && (
              <div className="scene scene-result">
                <Bubble mine>{known.id === 'know' ? '알았어. 다시 한 번 확인할게.' : '몰랐어. 지금 알게 돼서 다행이다.'}</Bubble>
                <Bubble>좋아. 다음엔 네 상황에 맞는 체크리스트로 이어갈게.</Bubble>
                <LinkPreview />
              </div>
            )}

            {sentMessages.length > 0 && <div className="sent-stack">{sentMessages.map((text, index) => <Bubble mine key={`${text}-${index}`}>{text}</Bubble>)}</div>}
          </div>
        </div>

        <div className="chat-footer">
          <form className="chat-composer" onSubmit={sendMessage}>
            <button type="button" className="camera-button" aria-label="카메라"><Camera size={20} /></button>
            <input value={message} onChange={(event) => setMessage(event.target.value)} onFocus={() => setKeyboardOpen(true)} inputMode="none" placeholder="메시지 보내기..." aria-label="메시지" />
            {message ? <button type="submit" className="composer-send" aria-label="메시지 보내기"><Send size={18} /></button> : <div className="composer-tools"><Mic size={18} /><ImageIcon size={18} /><Smile size={18} /></div>}
          </form>
          {!keyboardOpen && <div className="auto-message"><i /> 자취선배와 대화 중</div>}
          {keyboardOpen && <VirtualKeyboard onKey={handleKey} onClose={() => setKeyboardOpen(false)} />}
          <div className="home-indicator" />
        </div>

        <aside className="desktop-rail rail-right">JACHUI-SUNBAE · 2026</aside>
      </div>
    </main>
  )
}

export default App
