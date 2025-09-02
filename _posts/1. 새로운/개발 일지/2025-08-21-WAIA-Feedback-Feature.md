---
title: "WAIA 개발일지 - 인앱 피드백 기능 구현 및 버그 수정"
date: 2025-08-21
categories: [Diary, GameDevLog, WAIA]
tags: [JavaScript, CSS, HTML, Firebase, Firestore, BugFix, WAIA]
---

## 👋 개요

오늘은 사용자가 서비스에 대한 건의사항이나 새로운 서비스 추가 요청을 앱 내에서 직접 보낼 수 있는 피드백 기능을 구현했습니다. 기능 구현 후 발생한 UI 버그를 수정했으며, 추후 기능 확장으로 논의되었던 이메일 알림 시스템에 대한 기술적인 검토를 진행했습니다.

---

## 📝 오늘 한 일

- 사용자 피드백 기능 UI/UX 설계 및 구현
- 피드백 데이터 Firestore 연동 (feedback 컬렉션)
- 기능 구현 후 발생한 모달(팝업) UI 버그 수정
- 이메일 알림 기능 구현 방안 논의 및 기술 검토

---

## ✨ 주요 작업 내용

### 인앱(In-app) 피드백 기능 구현

사용자가 앱을 떠나지 않고 편리하게 의견을 제출할 수 있도록, 버튼 클릭 시 나타나는 팝업(모달) 창 형태의 피드백 기능을 추가했습니다.

**1. HTML 구조 추가 (`index.html`):**
'건의하기' 버튼과 피드백을 입력받는 폼이 포함된 모달의 기본 구조를 추가했습니다.

```html
<!-- Feedback Button -->
<div id="feedback-container">
    <button id="open-feedback-btn">서비스 추가 요청 / 건의하기</button>
</div>

<!-- Feedback Modal -->
<div id="feedback-modal" class="modal hidden">
    <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h2>무엇을 도와드릴까요?</h2>
        <form id="feedback-form">
            <textarea id="feedback-message" placeholder="여기에 내용을 입력하세요..." required></textarea>
            <button type="submit">의견 보내기</button>
        </form>
    </div>
</div>
```

**2. CSS 스타일링 (`style.css`):**
모달이 화면 중앙에 부드럽게 나타나고, 전체적인 앱 디자인과 통일성을 갖도록 스타일을 추가했습니다.

**3. JavaScript 로직 및 Firestore 연동 (`app.js`):**
'건의하기' 버튼과 닫기 버튼에 대한 이벤트 리스너를 추가하여 모달을 제어합니다. '의견 보내기' 버튼 클릭 시, 입력된 메시지를 Firestore의 `feedback` 컬렉션에 저장하도록 구현했습니다. 저장되는 데이터에는 메시지 내용, 타임스탬프, 그리고 로그인한 사용자의 정보가 포함됩니다.

```javascript
// Feedback Modal Listeners
openFeedbackBtn.addEventListener('click', () => {
  feedbackModal.classList.remove('hidden');
});

feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = feedbackMessage.value.trim();
  if (!message) return;

  try {
    await db.collection('feedback').add({
      message: message,
      userId: currentUser.uid, // null if not logged in
      userEmail: auth.currentUser ? auth.currentUser.email : 'anonymous',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    feedbackMessage.value = '';
    feedbackModal.classList.add('hidden');
    alert('소중한 의견 감사합니다!');

  } catch (error) {
    console.error("Error sending feedback: ", error);
    alert('오류가 발생했습니다. 다시 시도해주세요.');
  }
});
```

---

## 겪었던 문제 및 해결 과정

**문제:** 피드백 기능 구현 직후, 페이지를 열자마자 피드백 모달이 저절로 나타나고 닫기 버튼으로도 사라지지 않는 버그가 발생했습니다.

**시도:**
1.  `index.html` 파일에서 모달 `div`에 `hidden` 클래스가 제대로 적용되었는지 확인했습니다. -> 문제 없음.
2.  `app.js`의 모달 제어 로직이 잘못되었는지 확인했습니다. -> 문제 없음.
3.  CSS 스타일 충돌을 의심했습니다. `.modal`에 적용된 `display: flex;` 스타일과 `.hidden`의 `display: none;` 스타일이 충돌하여, `.hidden`이 무시되는 것으로 추정했습니다.

**해결:** CSS의 '명시도(Specificity)' 문제를 해결하기 위해, 더 구체적인 선택자를 사용하는 스타일 규칙을 `style.css`에 추가했습니다. 이로써 `.hidden` 클래스가 있을 때 모달이 확실하게 숨겨지도록 보장하여 버그를 해결했습니다.

```css
/* --- Bug Fix: Ensure modal is hidden by default --- */
.modal.hidden {
    display: none;
}
```

---

## 💡 새롭게 배운 점

*   **CSS 명시도(Specificity):** 클래스 이름이 같을 때 스타일이 예상과 다르게 적용된다면, 더 구체적인 선택자(예: `.modal.hidden`)를 사용하거나 스타일 적용 순서를 조정하여 해결할 수 있다는 점을 다시 한번 상기했습니다.
*   **Firebase 요금제:** Firebase Functions에서 외부 네트워크 요청(API 호출, 이메일 발송 등)을 사용하려면 Blaze(종량제) 요금제로 업그레이드가 필요하지만, 넉넉한 무료 사용량이 제공되어 소규모 프로젝트에서는 사실상 무료로 사용할 수 있다는 점을 배웠습니다.

---

## 🚀 다음 계획

*   사용자가 보낸 피드백을 관리자가 편하게 볼 수 있는 어드민(Admin) 페이지 또는 기능 구상
*   (보류) 새로운 피드백 수신 시 이메일 알림 기능 추가 (Firebase Functions 또는 외부 서비스 연동)
