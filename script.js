(() => {
  const fallbackData = window.APP_DATA || { topics: [], words: [], currentUser: {} };
  const keys = {
    topics: "vl_topics",
    words: "vl_words",
    user: "vl_user",
    loggedIn: "vl_logged_in"
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const params = new URLSearchParams(window.location.search);

  function readStore(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : structuredClone(fallback);
    } catch (error) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getTopics() {
    return readStore(keys.topics, fallbackData.topics);
  }

  function saveTopics(topics) {
    writeStore(keys.topics, topics);
  }

  function getWords() {
    return readStore(keys.words, fallbackData.words);
  }

  function saveWords(words) {
    writeStore(keys.words, words);
  }

  function getUser() {
    return readStore(keys.user, fallbackData.currentUser);
  }

  function saveUser(user) {
    writeStore(keys.user, user);
  }

  function isLoggedIn() {
    return localStorage.getItem(keys.loggedIn) === "true";
  }

  function setLoggedIn(value) {
    localStorage.setItem(keys.loggedIn, value ? "true" : "false");
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function topicById(id) {
    return getTopics().find(topic => Number(topic.id) === Number(id));
  }

  function wordsByTopic(topicId) {
    return getWords().filter(word => Number(word.topicId) === Number(topicId));
  }

  function countWords(topicId) {
    return wordsByTopic(topicId).length;
  }

  function nextId(items) {
    return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  }

  function readImageFile(file) {
    return new Promise(resolve => {
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function setMessage(text, type = "success") {
    const message = $("[data-form-message]");
    if (!message) return;
    message.textContent = text;
    message.className = `form-message ${type}`;
  }

  function setupSlider() {
    const slides = $$(".hero-banner .slide");
    if (!slides.length) return;

    let index = 0;
    const showSlide = () => {
      slides.forEach(slide => {
        slide.style.display = "none";
      });
      slides[index].style.display = "block";
      index = (index + 1) % slides.length;
      window.setTimeout(showSlide, 3000);
    };

    showSlide();
  }

  function renderTopicCard(topic) {
    const wordCount = countWords(topic.id);
    return `
      <article class="topic-item">
        <a href="topicvocabulary.html?topic=${encodeURIComponent(topic.id)}">
          <div class="topic-thumb">
            <img src="${escapeHtml(topic.image)}" alt="${escapeHtml(topic.name)}">
            <span>${wordCount} từ</span>
          </div>
          <p>${escapeHtml(topic.name)}</p>
        </a>
      </article>
    `;
  }

  function renderHome() {
    const topics = getTopics();
    const words = getWords();
    const featured = $("[data-featured-topics]");
    const myTopics = $("[data-my-topics]");
    const topicCount = $("[data-topic-count]");
    const wordCount = $("[data-word-count]");
    const reviewCount = $("[data-review-count]");

    if (topicCount) topicCount.textContent = topics.length;
    if (wordCount) wordCount.textContent = words.length;
    if (reviewCount) reviewCount.textContent = words.length;

    if (featured) {
      featured.innerHTML = topics.filter(topic => topic.featured).map(renderTopicCard).join("");
    }

    if (myTopics) {
      myTopics.innerHTML = topics.filter(topic => !topic.featured).map(renderTopicCard).join("");
    }

    setupSlider();
  }

  function setupHeaderAuth() {
    const user = getUser();
    const welcome = $("[data-user-welcome]");
    const authLink = $("[data-auth-link]");
    const registerLink = $("[data-register-link]");
    const logoutButton = $("[data-logout]");

    if (welcome && isLoggedIn()) {
      welcome.innerHTML = `Xin chào học sinh <a href="tranghoso.html" class="user-link">${escapeHtml(user.name)}</a>!`;
    }

    if (authLink) authLink.classList.toggle("hidden", isLoggedIn());
    if (registerLink) registerLink.classList.toggle("hidden", isLoggedIn());
    if (logoutButton) logoutButton.classList.toggle("hidden", !isLoggedIn());
  }

  function setupAuthForms() {
    const loginForm = $("[data-login-form]");
    if (loginForm) {
      loginForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = String(formData.get("email") || fallbackData.currentUser.email);
        const name = email.split("@")[0] || fallbackData.currentUser.name;

        saveUser({
          ...fallbackData.currentUser,
          ...getUser(),
          name,
          email
        });
        setLoggedIn(true);
        setMessage("Đăng nhập demo thành công. Đang chuyển về trang chủ...");
        window.setTimeout(() => {
          window.location.href = "index.html";
        }, 700);
      });
    }

    const registerForm = $("[data-register-form]");
    if (registerForm) {
      registerForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        saveUser({
          ...fallbackData.currentUser,
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          role: "hocsinh"
        });
        setMessage("Đăng ký demo thành công. Bạn có thể đăng nhập để xem giao diện học tập.");
        registerForm.reset();
      });
    }

    $$("[data-logout]").forEach(button => {
      button.addEventListener("click", () => {
        setLoggedIn(false);
        window.location.href = "index.html";
      });
    });
  }

  function fillTopicSelect(select, selectedId = "", includePlaceholder = true) {
    if (!select) return;

    const topics = getTopics();
    const placeholder = includePlaceholder ? '<option value="">-- Chọn chủ đề --</option>' : "";
    select.innerHTML = placeholder + topics.map(topic => {
      const selected = Number(topic.id) === Number(selectedId) ? "selected" : "";
      return `<option value="${topic.id}" ${selected}>${escapeHtml(topic.name)}</option>`;
    }).join("");
  }

  function renderManageTopics() {
    const tableBody = $("[data-topic-table]");
    if (!tableBody) return;

    const topics = getTopics();
    tableBody.innerHTML = topics.map((topic, index) => {
      const wordCount = countWords(topic.id);
      const deleteControl = wordCount < 10
        ? `<button type="button" class="delete-btn action-button" data-delete-topic="${topic.id}">Xóa</button>`
        : `<a class="delete-btn" href="verify_delete_topic.html?id=${topic.id}">Xóa</a>`;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(topic.name)}</td>
          <td><img class="topic-img" src="${escapeHtml(topic.image)}" alt="${escapeHtml(topic.name)}"></td>
          <td>${wordCount}</td>
          <td>
            <a class="edit-btn" href="suachude.html?id=${topic.id}">Sửa</a>
            ${deleteControl}
          </td>
        </tr>
      `;
    }).join("");
  }

  function setupManageTopics() {
    const form = $("[data-topic-form]");
    if (form) {
      form.addEventListener("submit", async event => {
        event.preventDefault();
        const topics = getTopics();
        const formData = new FormData(form);
        const image = await readImageFile(formData.get("HinhAnh"));

        topics.unshift({
          id: nextId(topics),
          name: String(formData.get("TenChuDe") || "").trim(),
          image: image || "image/banner1.jpg",
          featured: false
        });

        saveTopics(topics);
        form.reset();
        renderManageTopics();
      });
    }

    const tableBody = $("[data-topic-table]");
    if (tableBody) {
      tableBody.addEventListener("click", event => {
        const button = event.target.closest("[data-delete-topic]");
        if (!button) return;

        const id = Number(button.dataset.deleteTopic);
        if (!window.confirm("Xóa chủ đề này?")) return;

        saveTopics(getTopics().filter(topic => Number(topic.id) !== id));
        saveWords(getWords().filter(word => Number(word.topicId) !== id));
        renderManageTopics();
      });
    }

    renderManageTopics();
  }

  function setupEditTopic() {
    const form = $("[data-edit-topic-form]");
    if (!form) return;

    const id = Number(params.get("id"));
    const topic = topicById(id);
    const nameInput = form.elements.TenChuDe;
    const image = $("[data-current-topic-image]");

    if (!topic) {
      form.innerHTML = '<p class="empty-state">Không tìm thấy chủ đề.</p>';
      return;
    }

    nameInput.value = topic.name;
    image.src = topic.image;
    image.alt = topic.name;

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const topics = getTopics();
      const index = topics.findIndex(item => Number(item.id) === id);
      const formData = new FormData(form);
      const newImage = await readImageFile(formData.get("HinhAnh"));

      topics[index] = {
        ...topics[index],
        name: String(formData.get("TenChuDe") || "").trim(),
        image: newImage || topics[index].image
      };

      saveTopics(topics);
      window.location.href = "quanlychude.html";
    });
  }

  function renderWordTable() {
    const tableBody = $("[data-word-table]");
    if (!tableBody) return;

    const topics = getTopics();
    const topicName = topicId => topics.find(topic => Number(topic.id) === Number(topicId))?.name || "";

    tableBody.innerHTML = getWords().map((word, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(word.word)}</td>
        <td>${escapeHtml(word.type)}</td>
        <td>${escapeHtml(word.meaning)}</td>
        <td>${escapeHtml(word.pronunciation)}</td>
        <td>${escapeHtml(topicName(word.topicId))}</td>
        <td>
          <a href="suatv.html?id=${word.id}" class="btn-edit">Sửa</a>
          <button type="button" class="btn-delete action-button" data-delete-word="${word.id}">Xóa</button>
        </td>
      </tr>
    `).join("");
  }

  function setupManageWords() {
    const form = $("[data-word-form]");
    const select = $("[data-topic-select]");
    fillTopicSelect(select);

    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const words = getWords();
        const formData = new FormData(form);

        words.unshift({
          id: nextId(words),
          topicId: Number(formData.get("topic")),
          word: String(formData.get("word") || "").trim(),
          type: String(formData.get("type") || "").trim(),
          meaning: String(formData.get("meaning") || "").trim(),
          pronunciation: String(formData.get("pronunciation") || "").trim(),
          example: String(formData.get("example") || "").trim()
        });

        saveWords(words);
        form.reset();
        renderWordTable();
      });
    }

    const tableBody = $("[data-word-table]");
    if (tableBody) {
      tableBody.addEventListener("click", event => {
        const button = event.target.closest("[data-delete-word]");
        if (!button) return;

        const id = Number(button.dataset.deleteWord);
        if (!window.confirm("Xóa từ này?")) return;

        saveWords(getWords().filter(word => Number(word.id) !== id));
        renderWordTable();
        renderManageTopics();
      });
    }

    renderWordTable();
  }

  function setupEditWord() {
    const form = $("[data-edit-word-form]");
    if (!form) return;

    const id = Number(params.get("id"));
    const words = getWords();
    const word = words.find(item => Number(item.id) === id);

    if (!word) {
      form.innerHTML = '<p class="empty-state">Không tìm thấy từ vựng.</p>';
      return;
    }

    fillTopicSelect($("[data-topic-select]"), word.topicId, false);
    form.elements.word.value = word.word;
    form.elements.type.value = word.type;
    form.elements.meaning.value = word.meaning;
    form.elements.pronunciation.value = word.pronunciation;
    form.elements.example.value = word.example;

    form.addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(form);
      const updated = getWords().map(item => {
        if (Number(item.id) !== id) return item;
        return {
          ...item,
          topicId: Number(formData.get("topic")),
          word: String(formData.get("word") || "").trim(),
          type: String(formData.get("type") || "").trim(),
          meaning: String(formData.get("meaning") || "").trim(),
          pronunciation: String(formData.get("pronunciation") || "").trim(),
          example: String(formData.get("example") || "").trim()
        };
      });

      saveWords(updated);
      window.location.href = "quanlytuvung.html";
    });
  }

  function setupTopicVocabulary() {
    const title = $("[data-topic-title]");
    const topicIdInput = $("[data-topic-id]");
    const keywordInput = $("[data-topic-keyword]");
    const tableBody = $("[data-topic-words]");
    const form = $("[data-topic-search]");
    if (!tableBody) return;

    const topics = getTopics();
    const topicId = Number(params.get("topic")) || Number(topics[0]?.id);
    const keyword = String(params.get("keyword") || "").toLowerCase();
    const topic = topicById(topicId) || topics[0];

    if (title) title.textContent = `📘 Từ vựng chủ đề: ${topic?.name || "Không xác định"}`;
    if (topicIdInput) topicIdInput.value = topic?.id || "";
    if (keywordInput) keywordInput.value = params.get("keyword") || "";

    const words = wordsByTopic(topic?.id).filter(item => {
      if (!keyword) return true;
      return item.word.toLowerCase().startsWith(keyword);
    });

    tableBody.innerHTML = words.length
      ? words.map(word => `
        <tr>
          <td>${escapeHtml(word.word)}</td>
          <td>${escapeHtml(word.type)}</td>
          <td>${escapeHtml(word.meaning)}</td>
          <td>${escapeHtml(word.pronunciation)}</td>
          <td>${escapeHtml(word.example)}</td>
        </tr>
      `).join("")
      : '<tr><td colspan="5">Không tìm thấy từ vựng phù hợp.</td></tr>';

    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const nextKeyword = keywordInput.value.trim();
        window.location.href = `topicvocabulary.html?topic=${topic?.id || ""}&keyword=${encodeURIComponent(nextKeyword)}`;
      });
    }
  }

  function setupFlashcards() {
    const select = $("[data-flashcard-topic]");
    const card = $("#flashcard");
    const front = $("#card-front");
    const back = $("#card-back");
    if (!select || !card || !front || !back) return;

    let index = 0;
    let activeWords = [];

    select.innerHTML = '<option value="all">-- Tất cả chủ đề --</option>' + getTopics().map(topic => (
      `<option value="${topic.id}">${escapeHtml(topic.name)}</option>`
    )).join("");

    const renderCard = () => {
      card.classList.remove("flipped");

      if (!activeWords.length) {
        front.textContent = "Không có từ vựng";
        back.textContent = "";
        return;
      }

      const word = activeWords[index];
      front.textContent = word.word;
      back.textContent = [
        `Loại từ: ${word.type || ""}`,
        word.meaning || "",
        word.pronunciation ? `Phát âm: ${word.pronunciation}` : "",
        word.example ? `Ví dụ: ${word.example}` : ""
      ].filter(Boolean).join("\n");
    };

    const loadWords = () => {
      const value = select.value;
      activeWords = value === "all" ? getWords() : wordsByTopic(value);
      index = 0;
      renderCard();
    };

    select.addEventListener("change", loadWords);
    card.addEventListener("click", () => card.classList.toggle("flipped"));

    $("[data-next-card]")?.addEventListener("click", () => {
      if (!activeWords.length) return;
      index = (index + 1) % activeWords.length;
      renderCard();
    });

    $("[data-prev-card]")?.addEventListener("click", () => {
      if (!activeWords.length) return;
      index = (index - 1 + activeWords.length) % activeWords.length;
      renderCard();
    });

    loadWords();
  }

  function setupProfile() {
    const form = $("[data-profile-form]");
    if (!form) return;

    const user = getUser();
    $("#profile-name").value = user.name || "";
    $("#profile-email").value = user.email || "";
    $("#profile-birthday").value = user.birthday || "";
    $("[data-profile-role]").textContent = user.role || "hocsinh";

    form.addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(form);
      saveUser({
        ...getUser(),
        name: String(formData.get("name") || "").trim(),
        birthday: String(formData.get("birthday") || "")
      });
      setMessage("Cập nhật thông tin demo thành công.");
    });
  }

  function renderAdminSetting() {
    const tableBody = $("[data-admin-topic-table]");
    if (!tableBody) return;

    const rows = getTopics()
      .map(topic => ({ ...topic, wordCount: countWords(topic.id) }))
      .filter(topic => topic.wordCount >= 10);

    tableBody.innerHTML = rows.length
      ? rows.map((topic, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(topic.name)}</td>
          <td><img class="topic-img" src="${escapeHtml(topic.image)}" alt="${escapeHtml(topic.name)}"></td>
          <td>${topic.wordCount}</td>
          <td><a class="delete-btn" href="verify_delete_topic.html?id=${topic.id}">Xóa</a></td>
        </tr>
      `).join("")
      : '<tr><td colspan="5">Không có chủ đề cần xác minh.</td></tr>';
  }

  function setupVerifyDeleteTopic() {
    const form = $("[data-verify-delete-form]");
    if (!form) return;

    const id = Number(params.get("id"));
    const topic = topicById(id);
    const name = $("[data-delete-topic-name]");

    if (!topic) {
      name.textContent = "Không tìm thấy";
      form.classList.add("hidden");
      return;
    }

    name.textContent = topic.name;
    form.addEventListener("submit", event => {
      event.preventDefault();
      saveTopics(getTopics().filter(item => Number(item.id) !== id));
      saveWords(getWords().filter(word => Number(word.topicId) !== id));
      setMessage("Đã xóa chủ đề trong dữ liệu demo.");
      window.setTimeout(() => {
        window.location.href = "setting_admin.html";
      }, 700);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupHeaderAuth();
    setupAuthForms();

    const page = document.body.dataset.page;
    if (page === "home") renderHome();
    if (page === "manage-topics") setupManageTopics();
    if (page === "edit-topic") setupEditTopic();
    if (page === "manage-words") setupManageWords();
    if (page === "edit-word") setupEditWord();
    if (page === "topic-vocabulary") setupTopicVocabulary();
    if (page === "flashcard") setupFlashcards();
    if (page === "profile") setupProfile();
    if (page === "admin-setting") renderAdminSetting();
    if (page === "verify-delete-topic") setupVerifyDeleteTopic();
  });
})();
