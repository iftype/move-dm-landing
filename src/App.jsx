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

function ChoiceGroup({ title, choices, selectedId, onSelect }) {
  return (
    <div className="reply-choices">
      <div className="reply-choices-heading">
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
      <span className="link-url"><Link2 size={12} /> iftype.github.io/move-dm-landing/</span>
      <span className="link-meta">
        <i className="link-cover"><Check size={20} /></i>
        <span className="link-copy">
          <small>IFTYPE.GITHUB.IO</small>
          <strong>자취선배 | 계약 전에 물어볼 것</strong>
          <em>전입신고, 주거지원, 매물 조건을 짧게 확인해요.</em>
        </span>
        <ArrowRight size={17} />
      </span>
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
    label: '계약 전에 추가로 확인할 매물 조건',
    title: '전입신고, 말로만 듣고 넘기지 마.',
    body: '가능하다는 답을 받으면 계약서 특약에도 같은 내용이 들어가는지 확인해.',
    ask: '“전입신고와 확정일자가 가능한 집인지 계약서 특약에 적어주실 수 있을까요?”',
    keep: '답변은 문자나 메신저로 받아서 계약서와 같이 보관해둬.',
  },
  {
    key: 'support',
    label: '확인해볼 주거지원',
    title: '지원금은 집 계약 전에 한 번 찾아봐.',
    body: '지역과 신청 시기에 따라 이사비나 중개보수 지원 조건이 달라질 수 있어.',
    ask: '“이 집으로 계약하면 신청할 수 있는 청년 주거지원이 있을까요?”',
    keep: '거주 지역 청년정책 페이지와 접수 마감일을 캡처해둬.',
  },
  {
    key: 'condition',
    label: '중개인이나 집주인에게 물어볼 질문',
    title: '수리 얘기는 집 볼 때 바로 꺼내.',
    body: '누수나 곰팡이처럼 눈에 보이는 하자는 입주 전에 누가 수리할지 정해두는 게 좋아.',
    ask: '“지금 보이는 하자는 입주 전에 어디까지 수리해주시나요?”',
    keep: '하자 사진, 촬영 날짜, 수리하기로 한 대화를 같이 남겨둬.',
  },
  {
    key: 'record',
    label: '계약과 입주 때 보관할 서류와 기록',
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

function PrototypeInfo() {
  return (
    <section className="prototype-info">
      <h3>자취선배가 같이 확인하는 것</h3>
      <p>나이·지역·주거지원 경험과 보고 있는 집의 지역·보증금·월세·전입신고 가능 여부·주택 유형을 함께 살펴봐요.</p>
      <ul>
        <li><Check size={16} /><span><strong>확인해볼 주거지원</strong><small>지역과 신청 시기에 맞는 지원부터 확인해요.</small></span></li>
        <li><Check size={16} /><span><strong>계약 전에 추가로 확인할 매물 조건</strong><small>전입신고와 계약서 특약을 놓치지 않게 정리해요.</small></span></li>
        <li><Check size={16} /><span><strong>중개인이나 집주인에게 물어볼 질문</strong><small>그 자리에서 그대로 읽고 물어볼 수 있게 준비해요.</small></span></li>
        <li><Check size={16} /><span><strong>계약과 입주 때 보관할 서류와 기록</strong><small>계약서·등기부·사진과 대화를 한곳에 남겨요.</small></span></li>
      </ul>
      <p className="prototype-note">이 안내를 보기 전후로 새롭게 알게 된 지원과 확인 조건, 질문과 기록이 실제로 달라지는지 확인하고 있어요.</p>
      <div className="prototype-next"><strong>집을 보러 가는 날에도 이어져요</strong><p>다음에는 현장에서 확인한 내용과 사진·메모를 한 번에 남기는 흐름까지 준비할 예정이에요.</p></div>
    </section>
  )
}

function QuickCheck({ onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showMore, setShowMore] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
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

  const goPrevious = () => {
    setShowMore(false)
    setEmailSubmitted(false)
    if (step === 0) onClose()
    else setStep((value) => value - 1)
  }

  const submitEmail = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setEmailSubmitted(true)
  }

  return (
    <section className="quick-check" aria-label="계약 전 확인">
      <div className="quick-topbar">
        <button type="button" onClick={goPrevious}><ChevronLeft size={18} /> 이전 단계</button>
        <span>자취선배</span>
        <button type="button" className="quick-close" aria-label="닫기" onClick={onClose}><X size={17} /></button>
      </div>
      <div className="quick-stage" aria-hidden="true"><span style={{ width: `${(Math.min(step, quickQuestions.length) / quickQuestions.length) * 100}%` }} /></div>
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
            <p className="result-category">{priority.label}</p>
            <h2>{priority.title}</h2>
            <p className="quick-scope">{priority.body}</p>
            <div className="say-this">
              <span>그대로 물어봐</span>
              <blockquote>{priority.ask}</blockquote>
              <p>{priority.keep}</p>
            </div>
            <div className="result-grid">
              {showMore && otherResults.map((item) => <article key={item.key}><div><small>{item.label}</small><strong>{item.title}</strong><p>{item.body}</p></div></article>)}
            </div>
            <EvidencePreview />
            <button type="button" className="more-results" onClick={() => setShowMore((value) => !value)}>{showMore ? '여기까지만 볼게' : '이것도 같이 확인해봐'} <ChevronLeft size={14} className={showMore ? 'is-open' : ''} /></button>
            <PrototypeInfo />
            <form className="launch-email" onSubmit={submitEmail}>
              <label htmlFor="launch-email">서비스가 나오면 알려드릴게요</label>
              <div><input id="launch-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setEmailSubmitted(false) }} placeholder="이메일 주소" required /><button type="submit">메일로 받기</button></div>
              <small>{emailSubmitted ? '신청 화면을 확인했어요. 현재는 프로토타입이라 메일이 저장되지는 않아요.' : '현재는 알림 신청 화면만 제공하는 프로토타입이에요.'}</small>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

function App() {
  const chatBodyRef = useRef(null)
  const [introStep, setIntroStep] = useState(0)
  const [firstChoice, setFirstChoice] = useState(null)
  const [secondChoice, setSecondChoice] = useState(null)
  const [known, setKnown] = useState(null)
  const [message, setMessage] = useState('')
  const [sendFailed, setSendFailed] = useState(false)
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
  }, [introStep, firstChoice, secondChoice, known])

  const sendMessage = (event) => {
    event.preventDefault()
    const value = message.trim()
    if (!value) return
    setSendFailed(true)
  }

  const first = firstChoice ? firstChoices.find((choice) => choice.id === firstChoice.id) : null
  const second = secondChoice ? secondChoices.find((choice) => choice.id === secondChoice.id) : null

  return (
    <main className="dm-journey">
      <div className="dm-screen">
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
                {!firstChoice && <ChoiceGroup title="지금 이사 상황은 어때?" choices={firstChoices} onSelect={setFirstChoice} />}
              </div>
            )}

            {first && (
              <div className="scene">
                <Bubble mine>{first.label}</Bubble>
                <Bubble wide>{first.info}</Bubble>
                <Bubble>그럼 이번엔 이 중에서 골라봐.</Bubble>
                {!secondChoice && <ChoiceGroup title="지금 가장 걱정되는 건?" choices={secondChoices} onSelect={setSecondChoice} />}
              </div>
            )}

            {second && (
              <div className="scene">
                <Bubble mine>{second.label}</Bubble>
                <Bubble wide>{second.info}</Bubble>
                <Bubble>이 내용, 알고 있었어?</Bubble>
                {!known && <ChoiceGroup title="이사 전에 알고 있었어?" choices={[{ id: 'know', label: '알았어', info: '' }, { id: 'didnt-know', label: '몰랐어', info: '' }]} onSelect={setKnown} />}
              </div>
            )}

            {known && (
              <div className="scene scene-result">
                <Bubble mine>{known.id === 'know' ? '알았어. 다시 한 번 확인할게.' : '몰랐어. 지금 알게 돼서 다행이다.'}</Bubble>
                <Bubble>계약 전에 물어볼 것들, 여기 정리해뒀어.</Bubble>
                <LinkPreview onOpen={() => setShowQuickCheck(true)} />
              </div>
            )}
          </div>
        </div>

        <div className="chat-footer">
          <form className="chat-composer" onSubmit={sendMessage}>
            <button type="button" className="camera-button" aria-label="카메라"><Camera size={20} /></button>
            <input type="text" value={message} onChange={(event) => { setMessage(event.target.value); setSendFailed(false) }} autoComplete="off" placeholder="메시지 보내기..." aria-label="메시지" />
            {message ? <button type="submit" className="composer-send" aria-label="메시지 보내기"><Send size={18} /></button> : <div className="composer-tools"><Mic size={18} /><ImageIcon size={18} /><Smile size={18} /></div>}
          </form>
          {sendFailed ? <div className="send-error">전송에 실패했어요. 체험용 채팅에서는 메시지를 보낼 수 없어요.</div> : <div className="auto-message"><i /> 자취선배와 대화 중</div>}
          <div className="home-indicator" />
        </div>

        <aside className="desktop-rail rail-right">JACHUI-SUNBAE · 2026</aside>
        {showQuickCheck && <QuickCheck onClose={() => setShowQuickCheck(false)} />}
      </div>
    </main>
  )
}

export default App
