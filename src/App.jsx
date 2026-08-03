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
          <strong>자취선배 | 내 집 보기 체크리스트</strong>
          <em>10개만 답하면 계약 전에 확인할 항목을 골라드려요.</em>
        </span>
        <ArrowRight size={17} />
      </span>
    </button>
  )
}

const quickQuestions = [
  { key: 'age', label: '나이는 어느 쪽에 가까워?', options: ['만 19–24세', '만 25–29세', '만 30–34세', '만 35세 이상'] },
  { key: 'userRegion', label: '지금 살고 있는 지역은 어디야?', options: ['서울', '경기·인천', '그 외 지역'] },
  { key: 'support', label: '혹시 청년 지원금, 받아본 적 있어?', options: ['아직 한 번도 없어', '예전에 받아봤어', '뭐가 있는지 모르겠어'] },
  { key: 'homeRegion', label: '지금 보는 집, 지역이 어디야?', options: ['서울', '경기·인천', '그 외 지역', '아직 못 정했어'] },
  { key: 'deposit', label: '보증금은 어느 정도야?', options: ['1천만 원 이하', '1천–5천만 원', '5천만 원 이상', '아직 정하는 중'] },
  { key: 'rent', label: '월세는 어느 정도야?', options: ['50만 원 이하', '50–80만 원', '80만 원 이상', '아직 정하는 중'] },
  { key: 'movein', label: '전입신고 된다고 집주인이 말했어?', options: ['된다고 들었어', '아직 안 물어봤어', '안 된다고 했어'] },
  { key: 'homeType', label: '보려는 집은 어떤 형태야?', options: ['원룸·투룸', '오피스텔', '다가구·다세대', '아직 모르겠어'] },
  { key: 'moveTiming', label: '계약이나 이사는 언제쯤이야?', options: ['2주 안', '한 달 안', '두 달 이후', '아직 정하지 않았어'] },
  { key: 'concern', label: '지금 제일 먼저 알고 싶은 건?', options: ['받을 수 있는 주거지원', '이 집에서 더 볼 조건', '중개인에게 물어볼 말', '꼭 남겨둘 서류와 기록'] },
]

function getQuickResults(answers) {
  const region = answers.homeRegion === '아직 못 정했어' ? answers.userRegion : answers.homeRegion
  const listing = [region, answers.homeType].filter(Boolean).join(' · ')

  return [
    {
      key: 'support',
      label: '확인해볼 주거지원',
      title: `${region || '이사할 지역'} 지원은 계약 전에 다시 찾아봐.`,
      body: `${answers.age || '나이'}와 ${region || '지역'}을 기준으로 이사비·중개보수·월세 지원의 신청 시기와 소득 조건을 먼저 확인해.`,
      actionLabel: '먼저 확인해',
      ask: '거주 지역 청년정책 페이지에서 나이, 소득, 계약일 조건을 같이 보기',
      keep: `지원 경험은 “${answers.support || '미응답'}”. 지원 이름과 접수 마감일을 캡처해둬.`,
    },
    {
      key: 'condition',
      label: '계약 전에 추가로 확인할 매물 조건',
      title: `${listing || '이 집'} 조건, 말로만 듣고 넘기지 마.`,
      body: `보증금 ${answers.deposit || '미정'}, 월세 ${answers.rent || '미정'} 기준이야. 전입신고 답변과 실제 계약서 특약이 같은지 확인해.`,
      actionLabel: '계약 전에 물어봐',
      ask: '“전입신고와 확정일자가 가능한 집인지 계약서 특약에 적어주실 수 있을까요?”',
      keep: `현재 답변은 “${answers.movein || '미응답'}”. 최신 등기부와 건축물대장도 계약 전에 다시 확인해.`,
    },
    {
      key: 'question',
      label: '중개인이나 집주인에게 물어볼 질문',
      title: '수리와 관리비 얘기는 집 볼 때 바로 꺼내.',
      body: `${listing || '보고 있는 집'}에서 눈에 보이는 하자, 관리비 포함 항목, 퇴실 조건을 그 자리에서 물어보는 게 좋아.`,
      actionLabel: '그대로 물어봐',
      ask: '“지금 보이는 하자는 언제까지 수리되고, 관리비에는 어떤 항목이 포함되나요?”',
      keep: '답변은 문자나 메신저로 다시 받아서 집 사진과 같이 남겨둬.',
    },
    {
      key: 'record',
      label: '계약과 입주 때 보관할 서류와 기록',
      title: `${answers.moveTiming || '계약 전'}부터 한 폴더에 모아둬.`,
      body: '계약서, 등기부, 집 상태 사진과 주고받은 대화를 흩어두면 막상 필요할 때 찾기 어려워.',
      actionLabel: '이렇게 남겨',
      ask: '계약 전 · 계약 당일 · 입주 당일 폴더를 만들고 원본 파일 넣기',
      keep: '파일명에 집 주소 일부와 날짜를 적고, 입주 당일에는 벽·바닥·창가를 영상으로도 남겨둬.',
    },
  ]
}

function getChecklistItems(answers) {
  const region = answers.homeRegion === '아직 못 정했어' ? answers.userRegion : answers.homeRegion

  return [
    {
      category: '지원·권리',
      title: `${region || '이사할 지역'}에서 받을 수 있는 주거지원의 마감일을 확인했어?`,
      detail: `${answers.age || '나이'}와 계약 예정일을 함께 보고, 신청 전 계약이 필요한지도 확인해.`,
    },
    {
      category: '전입신고',
      title: '전입신고와 확정일자가 가능하다는 내용을 특약에 적었어?',
      detail: `지금 답변은 “${answers.movein || '미응답'}”. 말로 들은 내용과 계약서가 같은지 봐.`,
    },
    {
      category: '보증금',
      title: '계약하는 날 다시 발급한 등기부에서 소유자와 근저당을 확인했어?',
      detail: `${answers.deposit || '보증금 미정'}이라도 계약 직전의 권리관계를 기준으로 확인해야 해.`,
    },
    {
      category: '고정비',
      title: '월세 밖에서 매달 빠지는 관리비 항목을 모두 적었어?',
      detail: `${answers.rent || '월세 미정'}에 수도·전기·가스·인터넷·주차비를 더해 비교해.`,
    },
    {
      category: '사진·기록',
      title: `${answers.homeType || '집'}의 벽·천장·창틀과 옵션 상태를 사진으로 남겼어?`,
      detail: '수리 약속은 촬영 날짜가 남는 사진과 문자, 계약서 특약으로 같이 보관해.',
    },
  ]
}

function ChecklistPreview({ answers }) {
  const [checkedItems, setCheckedItems] = useState([])
  const items = getChecklistItems(answers)

  const toggleItem = (index) => {
    setCheckedItems((value) => value.includes(index) ? value.filter((item) => item !== index) : [...value, index])
  }

  return (
    <section className="checklist-preview" aria-labelledby="checklist-preview-title">
      <div className="checklist-preview-heading">
        <div><span>내 조건으로 먼저 고른 항목</span><h3 id="checklist-preview-title">다음 방에서 이 5개부터 확인해.</h3></div>
        <strong>{checkedItems.length} / 5</strong>
      </div>
      <div className="personal-checklist">
        {items.map((item, index) => {
          const checked = checkedItems.includes(index)
          return (
            <button type="button" role="checkbox" aria-checked={checked} className={checked ? 'is-checked' : ''} key={item.title} onClick={() => toggleItem(index)}>
              <i>{checked && <Check size={15} />}</i>
              <span><small>{item.category}</small><strong>{item.title}</strong><em>{item.detail}</em></span>
            </button>
          )
        })}
      </div>
      <p className="checklist-more"><strong>+ 19개</strong> 누수·배수·방음·옵션·계약 특약·입주 기록까지 전체 체크리스트에 이어져요.</p>
    </section>
  )
}

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
      <h3>지금 무엇을 검증하고 있나요?</h3>
      <p>첫 검증 범위는 <strong>계약 전 주거지원과 매물 조건 확인</strong>입니다. 나이·지역·주거지원 경험과 매물의 지역·보증금·월세·전입신고 가능 여부·주택 유형을 함께 확인해요.</p>
      <ul>
        <li><Check size={16} /><span><strong>확인해볼 주거지원</strong><small>지역과 신청 시기에 맞는 지원부터 확인해요.</small></span></li>
        <li><Check size={16} /><span><strong>계약 전에 추가로 확인할 매물 조건</strong><small>전입신고와 계약서 특약을 놓치지 않게 정리해요.</small></span></li>
        <li><Check size={16} /><span><strong>중개인이나 집주인에게 물어볼 질문</strong><small>그 자리에서 그대로 읽고 물어볼 수 있게 준비해요.</small></span></li>
        <li><Check size={16} /><span><strong>계약과 입주 때 보관할 서류와 기록</strong><small>계약서·등기부·사진과 대화를 한곳에 남겨요.</small></span></li>
      </ul>
      <p className="prototype-note">프로토타입 사용 전후로 새롭게 발견한 지원, 확인 조건, 질문과 기록이 실제로 달라지는지 외부 사용자에게 확인하고 있어요.</p>
      <div className="prototype-next"><strong>다음은 집 보기 현장의 기록이에요</strong><p>이 결과를 바탕으로 현장에서 확인한 내용과 사진·메모를 남기는 흐름으로 확장하려 해요.</p></div>
    </section>
  )
}

const housingFacts = [
  {
    category: '청년월세',
    title: '만 29세라고 청년월세 지원을 받는 건 아니야.',
    body: '나이뿐 아니라 부모와 따로 사는지, 무주택인지, 청년가구·원가구의 소득과 재산, 기존 지원 수혜 여부를 함께 확인해.',
    sources: [{ label: '마이홈 청년월세지원 자가진단', href: 'https://www.myhome.go.kr/hws/portal/dgn/selectSelfDiagnosisYouthHousView.do' }],
  },
  {
    category: '가족 간 임차',
    title: '부모님이나 형제자매 집에 월세를 내도 제외될 수 있어.',
    body: '국가 청년월세 지원 자가진단은 직계존속과 형제·자매 등 2촌 이내 혈족의 주택을 임차한 경우를 제외 대상으로 안내해.',
    sources: [{ label: '마이홈 제외대상 확인', href: 'https://www.myhome.go.kr/hws/portal/dgn/selectSelfDiagnosisYouthHousView.do' }],
  },
  {
    category: '지역 지원',
    title: '국가 지원에서 탈락했다고 끝은 아니야.',
    body: '지자체가 별도의 월세·주거비 지원을 운영할 수 있어. 현재 거주 지역과 이사할 지역의 공고를 각각 다시 확인해봐.',
    sources: [{ label: '마이홈 지자체 지원사업 현황', href: 'https://www.myhome.go.kr/hws/portal/dgn/selectSelfDiagnosisYouthHousView.do' }],
  },
  {
    category: '셰어하우스',
    title: '셰어하우스라도 별도 계약이면 가능성이 남아 있어.',
    body: '한 방에 여러 명이 거주하는 전대차는 원칙적으로 제외되지만, 각자가 임대인과 별도 임대차계약을 맺은 경우는 지원 가능 대상으로 안내돼.',
    sources: [{ label: '마이홈 임차계약 제외·예외 조건', href: 'https://www.myhome.go.kr/hws/portal/dgn/selectSelfDiagnosisYouthHousView.do' }],
  },
  {
    category: '실제 주거비',
    title: '월세 50만 원이 정말 더 저렴한지 다시 계산해봐.',
    body: '보증금 1억 원을 연 3%로 빌린다고 가정하면 이자만 월 약 25만 원이야. 대출 가능 여부, 보증료, 관리비와 보증금 반환 위험까지 더해야 실제 비용이 보여.',
    note: '계산 예시: 1억 원 × 연 3% ÷ 12개월 = 월 25만 원',
    sources: [],
  },
  {
    category: '관리비',
    title: '월세만 보고 계약하면 관리비에서 예산이 무너질 수 있어.',
    body: '월 10만 원 이상의 정액 관리비는 인터넷 광고에서 일반관리비·전기·수도·가스·난방·인터넷 등을 비목별로 표시하는 것이 원칙이야. 그래도 최근 고지서와 별도 공과금은 직접 확인해.',
    sources: [{ label: '중개대상물 표시·광고 세부기준', href: 'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000250356&chrClsCd=010201' }],
  },
  {
    category: '전입신고',
    title: '전입신고가 안 되는 방은 주소만의 문제가 아니야.',
    body: '주택을 인도받고 주민등록을 마쳐야 다음 날부터 제삼자에 대한 대항력이 생겨. 계약서 주소와 주민등록 주소가 다르면 월세액 세액공제도 받을 수 없어.',
    sources: [
      { label: '주택임대차보호법 제3조', href: 'https://law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000600000&languageType=KO&lsNm=%EC%A3%BC%ED%83%9D%EC%9E%84%EB%8C%80%EC%B0%A8%EB%B3%B4%ED%98%B8%EB%B2%95&paras=1' },
      { label: '국세청 월세액 세액공제 안내', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=239025&mi=40613' },
    ],
  },
  {
    category: '확정일자',
    title: '확정일자만 받는다고 우선변제권이 완성되지는 않아.',
    body: '우선변제권은 실제 입주, 주민등록, 임대차계약서의 확정일자를 함께 갖춰야 해. 하나만 챙기고 끝내지 마.',
    sources: [{ label: '주택임대차보호법과 판례', href: 'https://www.law.go.kr/LSW/precInfoP.do?precSeq=129685' }],
  },
  {
    category: '건축물 용도',
    title: '광고는 원룸인데 건축물대장은 근린생활시설일 수 있어.',
    body: 'HUG는 근린생활시설을 전세보증금반환보증 대상 주택에서 제외해. 광고의 이름보다 건축물대장상 용도를 먼저 확인해.',
    sources: [{ label: 'HUG 전세보증반환 상품 안내', href: 'https://onestop.khug.or.kr/webView/webBiz/apply/goods001' }],
  },
  {
    category: '연말정산',
    title: '반전세의 대출 공제와 월세 공제, 무조건 하나만 고르는 건 아니야.',
    body: '주택임차차입금 원리금 상환액 소득공제와 월세액 세액공제는 각각의 무주택·소득·주택·전입 요건을 충족하면 함께 적용될 수 있어. 해당 귀속연도 국세청 안내로 다시 확인해.',
    sources: [
      { label: '국세청 주택임차차입금 안내', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=239021&mi=40629' },
      { label: '국세청 월세액 세액공제 안내', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=239025&mi=40613' },
    ],
  },
]

function HousingFacts() {
  return (
    <section className="housing-facts">
      <p className="section-kicker">계약 전에 알았으면 달라지는 것</p>
      <h3>나이와 월세만 보고는<br />판단할 수 없는 10가지.</h3>
      <p className="housing-facts-intro">모두 외울 필요는 없어. 내 상황과 가까운 질문부터 열어보고, 계약 전에는 공식 출처에서 한 번 더 확인해.</p>
      <div className="fact-list">
        {housingFacts.map((fact, index) => (
          <details key={fact.title} open={index === 0}>
            <summary><span>{fact.category}</span><strong>{fact.title}</strong></summary>
            <div className="fact-body">
              <p>{fact.body}</p>
              {fact.note && <code>{fact.note}</code>}
              {fact.sources.length > 0 && <div className="fact-sources">{fact.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>}
            </div>
          </details>
        ))}
      </div>
      <p className="fact-disclaimer">자취선배는 지원 자격, 법적 안전, 보증 가입 또는 세액공제 가능 여부를 확정하지 않아요. 실제 신청·계약 전에는 최신 공고와 공식 기관 안내를 확인하세요.</p>
    </section>
  )
}

function ProjectDirection() {
  return (
    <section className="project-direction">
      <p className="section-kicker">우리가 만드는 방식</p>
      <h3>기능 수보다,<br />실제로 쓰는 이유부터 확인합니다.</h3>
      <div className="project-levels">
        <article><span>레벨 3</span><strong>사용 이유가 분명한 MVP</strong><p>핵심 문제를 먼저 해결하고, 외부 사용자의 인터뷰와 테스트로 실제 문제인지 확인해요. 공개 가능한 사용 흐름과 안정성을 갖추고 설계·기술 선택의 근거를 기록합니다.</p></article>
        <article><span>레벨 4</span><strong>사용자 반응으로 운영·개선</strong><p>서비스가 필요한 곳에 직접 알리고, 사용자가 다시 찾을 이유를 만들어요. 실제 반응을 바탕으로 제품과 시스템을 함께 개선합니다.</p></article>
      </div>
      <p className="project-outcome">문제 발견 → 개발 → 배포 → 운영 → 개선까지, 실제 사용자가 있는 서비스의 경험을 남기는 것이 목표예요.</p>
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
  const quickResults = getQuickResults(answers)
  const concernPriority = {
    '받을 수 있는 주거지원': 'support',
    '이 집에서 더 볼 조건': 'condition',
    '중개인에게 물어볼 말': 'question',
    '꼭 남겨둘 서류와 기록': 'record',
  }
  const priorityKey = concernPriority[answers.concern]
    || (answers.movein !== '된다고 들었어' ? 'condition' : answers.support !== '예전에 받아봤어' ? 'support' : 'record')
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
            <p className="result-context">{answers.age} · {answers.homeRegion} · {answers.homeType} · {answers.moveTiming}</p>
            <p className="result-category">{priority.label}</p>
            <h2>{priority.title}</h2>
            <p className="quick-scope">{priority.body}</p>
            <div className="say-this">
              <span>{priority.actionLabel}</span>
              <blockquote>{priority.ask}</blockquote>
              <p>{priority.keep}</p>
            </div>
            <button type="button" className="more-results" onClick={() => setShowMore((value) => !value)}>{showMore ? '중요한 한 가지만 볼게' : '내 조건에 맞는 큐레이션 더 받기'} <ChevronLeft size={14} className={showMore ? 'is-open' : ''} /></button>
            <div className="result-grid">
              {showMore && otherResults.map((item) => <article key={item.key}><div><small>{item.label}</small><strong>{item.title}</strong><p>{item.body}</p></div></article>)}
            </div>
            <ChecklistPreview answers={answers} />
            <EvidencePreview />
            <HousingFacts />
            <PrototypeInfo />
            <ProjectDirection />
            <form className="launch-email checklist-delivery" onSubmit={submitEmail}>
              <p>다음 집을 보기 전에</p>
              <h3>24개 전체 체크리스트와<br />매물 비교 기록지를 받아봐.</h3>
              <span>방을 보면서 바로 열 수 있도록 입력한 이메일로 보내드려요.</span>
              <label htmlFor="checklist-email">받을 이메일</label>
              <div><input id="checklist-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setEmailSubmitted(false) }} placeholder="이메일 주소" required /><button type="submit">체크리스트 받기</button></div>
              <small>{emailSubmitted ? '체크리스트 발송 신청을 확인했어요. 현재는 프로토타입이라 실제 메일은 발송되지 않아요.' : '이메일은 체크리스트 발송 용도로만 사용한다는 흐름을 검증하고 있어요.'}</small>
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
          <button type="button" className="header-site" aria-label="집 보기 체크리스트 만들기" onClick={() => setShowQuickCheck(true)}><Check size={15} /> 체크리스트</button>
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
                <Bubble>내 조건에 맞는 집 보기 체크리스트, 여기서 만들어줄게.</Bubble>
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
