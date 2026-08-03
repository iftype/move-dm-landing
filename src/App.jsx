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
  X,
} from 'lucide-react'

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

function LinkPreview({ onOpen }) {
  return (
    <button type="button" className="link-preview" onClick={onOpen}>
      <span className="link-domain"><Link2 size={13} /> JACHUI-SUNBAE.KR</span>
      <strong>계약 전에 뭘 물어볼지<br />같이 정리해보기</strong>
      <small>잘 모르겠는 건 모른다고 답해도 괜찮아요.</small>
      <i><ArrowRight size={17} /></i>
    </button>
  )
}

const quickQuestions = [
  { key: 'support', label: '혹시 청년 지원금, 받아본 적 있어?', options: ['아직 한 번도 없어', '예전에 받아봤어', '뭐가 있는지 모르겠어'] },
  { key: 'home', label: '지금 보는 집, 지역이 어디야?', options: ['서울·수도권', '광역시', '아직 못 정했어'] },
  { key: 'budget', label: '보증금이랑 월세는 어느 정도야?', options: ['보증금 1천 / 월세 60 이하', '보증금 3천 / 월세 80 이하', '아직 정하는 중'] },
  { key: 'movein', label: '전입신고 된다고 집주인이 말했어?', options: ['된다고 들었어', '아직 안 물어봤어', '안 된다고 했어'] },
]

const quickResults = [
  {
    key: 'movein',
    title: '전입신고, 말로만 듣고 넘기지 마.',
    body: '가능하다는 답을 받으면 계약서 특약에도 같은 내용이 들어가는지 확인해.',
    ask: '“전입신고와 확정일자가 가능한 집인지 계약서 특약에 적어주실 수 있을까요?”',
    keep: '답변은 문자나 메신저로 받아서 계약서와 같이 보관해둬.',
  },
  {
    key: 'support',
    title: '지원금은 집 계약 전에 한 번 찾아봐.',
    body: '지역과 신청 시기에 따라 이사비나 중개보수 지원 조건이 달라질 수 있어.',
    ask: '“이 집으로 계약하면 신청할 수 있는 청년 주거지원이 있을까요?”',
    keep: '거주 지역 청년정책 페이지와 접수 마감일을 캡처해둬.',
  },
  {
    key: 'condition',
    title: '수리 얘기는 집 볼 때 바로 꺼내.',
    body: '누수나 곰팡이처럼 눈에 보이는 하자는 입주 전에 누가 수리할지 정해두는 게 좋아.',
    ask: '“지금 보이는 하자는 입주 전에 어디까지 수리해주시나요?”',
    keep: '하자 사진, 촬영 날짜, 수리하기로 한 대화를 같이 남겨둬.',
  },
  {
    key: 'record',
    title: '서류와 사진은 한 폴더에 모아둬.',
    body: '계약서, 등기부, 집 상태 사진을 흩어두면 막상 필요할 때 찾기 어려워.',
    ask: '“계약 전에 최신 등기부와 관리비 내역도 볼 수 있을까요?”',
    keep: '계약 전·입주 당일 폴더를 나눠서 원본 파일을 보관해둬.',
  },
]

function EvidencePreview() {
  return (
    <figure className="evidence-preview">
      <div className="evidence-heading"><strong>계약 전에 남길 것</strong><span>사진 · 계약서 · 등기부</span></div>
      <div className="evidence-photo" role="img" aria-label="입주 전 방 내부를 촬영한 예시 사진"><span>집 보러 간 날</span><b>창가 누수 흔적</b></div>
      <div className="evidence-paper evidence-contract"><small>계약서 예시</small><strong>전입신고 가능</strong><i>특약 03</i></div>
      <div className="evidence-paper evidence-registry"><small>등기부 예시</small><strong>근저당 확인</strong><i>갑구 · 을구</i></div>
      <figcaption>개인정보를 가린 예시예요. 계약 전에 이 세 가지를 같이 남겨둬.</figcaption>
    </figure>
  )
}

function QuickCheck({ onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showMore, setShowMore] = useState(false)
  const current = quickQuestions[step]
  const complete = step >= quickQuestions.length
  const priorityKey = answers.movein !== '된다고 들었어'
    ? 'movein'
    : answers.support !== '예전에 받아봤어'
      ? 'support'
      : answers.budget === '아직 정하는 중'
        ? 'condition'
        : 'record'
  const priority = quickResults.find((item) => item.key === priorityKey)
  const otherResults = quickResults.filter((item) => item.key !== priorityKey)

  const choose = (answer) => {
    if (!current) return
    setAnswers((value) => ({ ...value, [current.key]: answer }))
    setStep((value) => value + 1)
  }

  return (
    <section className="quick-check" aria-label="계약 전 확인">
      <div className="quick-topbar">
        <button type="button" onClick={onClose}><ChevronLeft size={18} /> 대화로 돌아가기</button>
        <span>자취선배</span>
        <button type="button" className="quick-close" aria-label="닫기" onClick={onClose}><X size={17} /></button>
      </div>
      <div className="quick-main">
        {!complete ? (
          <>
            <h2>{current.label}</h2>
            <p className="quick-help">잘 모르겠으면 그냥 모른다고 골라도 돼.</p>
            <div className="quick-options">
              {current.options.map((option) => <button type="button" key={option} onClick={() => choose(option)}><span>{option}</span><ArrowRight size={16} /></button>)}
            </div>
          </>
        ) : (
          <div className="quick-result">
            <h2>{priority.title}</h2>
            <p className="quick-scope">{priority.body}</p>
            <div className="say-this">
              <span>그대로 물어봐</span>
              <blockquote>{priority.ask}</blockquote>
              <p>{priority.keep}</p>
            </div>
            <div className="result-grid">
              {showMore && otherResults.map((item) => <article key={item.key}><div><strong>{item.title}</strong><p>{item.body}</p></div></article>)}
            </div>
            <EvidencePreview />
            <button type="button" className="more-results" onClick={() => setShowMore((value) => !value)}>{showMore ? '여기까지만 볼게' : '이것도 같이 확인해봐'} <ChevronLeft size={14} className={showMore ? 'is-open' : ''} /></button>
            <button type="button" className="quick-back" onClick={() => { setStep(0); setAnswers({}); setShowMore(false) }}>다시 답하기</button>
          </div>
        )}
      </div>
    </section>
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
  const [showQuickCheck, setShowQuickCheck] = useState(false)

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
          <button type="button" className="header-site" aria-label="계약 전에 물어보기" onClick={() => setShowQuickCheck(true)}><Check size={15} /> 계약 질문</button>
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
                <LinkPreview onOpen={() => setShowQuickCheck(true)} />
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
        {showQuickCheck && <QuickCheck onClose={() => setShowQuickCheck(false)} />}
      </div>
    </main>
  )
}

export default App
