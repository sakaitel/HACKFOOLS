/* ==========================================================
   1. ÁRVORE DE DIÁLOGOS ARTIFICIAIS (MÚLTIPLA ESCOLHA)
   ========================================================== */
const dialogueTrees = {
  default: {
    start: {
      initialMsg: "Olá. Detectei afinidade espectral entre nossos perfis. Como vão suas funções biológicas?",
      options: [
        {
          text: "1. Minhas taxas de oxigênio e glicose operam em níveis satisfatórios.",
          alienReply: "Excelente. Um sistema circulatório estável é o alicerce de qualquer romance interplanetário.",
          nextStep: "hobby"
        },
        {
          text: "2. [Rir nervosamente] Haha sim... você tem muitos tentáculos/ossos?",
          alienReply: "Possuo a quantidade padrão exigida pelo Ministério de Anatomia do meu quadrante. Você pergunta por afeto ou para fins de consumo?",
          nextStep: "intencao"
        },
        {
          text: "3. Olá! Seu planeta parece muito legal, você curte música ou jogos?",
          alienReply: "Aprecio frequências sonoras que não explodam meus tímpanos e jogos que não envolvam destruição termonuclear.",
          nextStep: "encontro"
        }
      ]
    },
    hobby: {
      options: [
        {
          text: "1. Gostaria de agendar um encontro formal para ingerirmos nutrientes juntos?",
          alienReply: "Uma ingestão calórica compartilhada soa altamente erótica. Aceito.",
          nextStep: "fim"
        },
        {
          text: "2. Você prefere falar sobre o paradoxo do teletransporte ou o clima estelar?",
          alienReply: "O teletransporte é apenas suicídio com cópia física. Prefiro falar da chuva de ácido sulfúrico de ontem.",
          nextStep: "fim"
        },
        {
          text: "3. Concordo plenamente. Vamos apenas nos encarar em silêncio confortável.",
          alienReply: "✦ [Conexão mantida em silêncio absoluto por 47 minutos. O amor venceu.] ✦",
          nextStep: "fim"
        }
      ]
    },
    intencao: {
      options: [
        {
          text: "1. Foi apenas uma piada terrestre mal calibrada. Peço perdão diplomático.",
          alienReply: "Desculpas aceitas. O humor humano é um mistério neurológico fascinante.",
          nextStep: "fim"
        },
        {
          text: "2. Para afeto! Acho exesqueletos/peles coloridas extremamente atraentes.",
          alienReply: "Isso aquece meu núcleo de combustão interna. Vamos marcar de nos ver.",
          nextStep: "fim"
        },
        {
          text: "3. [Mudar de assunto bruscamente] E sobre a monogamia, qual sua tese?",
          alienReply: "Monogamia é eficiente para cálculo de herança de asteroides, mas arriscada em chuvas de meteoros.",
          nextStep: "fim"
        }
      ]
    },
    encontro: {
      options: [
        {
          text: "1. Que coincidência! Eu também não gosto de explosões termonucleares!",
          alienReply: "Incrível! Já temos 100% dos valores fundamentais alinhados.",
          nextStep: "fim"
        },
        {
          text: "2. Quer ir a um bar interestelar tomar hidrogênio líquido?",
          alienReply: "Perfeito. Se eu evaporar, foi apenas timidez.",
          nextStep: "fim"
        },
        {
          text: "3. Isso foi muito formal. Posso te chamar de 'chuchu galáctico'?",
          alienReply: "Processando apelido... Definição não encontrada, mas autorizada com 98% de carinho.",
          nextStep: "fim"
        }
      ]
    },
    fim: {
      options: []
    }
  }
};

/* ==========================================================
   2. CONTROLE DE ABAS E NAVEGAÇÃO
   ========================================================== */
const tabDiscover = document.getElementById("tabDiscover");
const tabMatches = document.getElementById("tabMatches");
const viewDiscover = document.getElementById("viewDiscover");
const viewMatches = document.getElementById("viewMatches");
const matchBadge = document.getElementById("matchBadge");

const container = document.getElementById("cardsContainer");
const likeBtn = document.getElementById("likeBtn");
const nopeBtn = document.getElementById("nopeBtn");

const chatListView = document.getElementById("chatListView");
const chatRoomView = document.getElementById("chatRoomView");
const matchesHorizontal = document.getElementById("matchesHorizontal");
const conversationsList = document.getElementById("conversationsList");
const backToChatList = document.getElementById("backToChatList");
const roomAvatar = document.getElementById("roomAvatar");
const roomName = document.getElementById("roomName");
const roomSpecies = document.getElementById("roomSpecies");
const chatMessages = document.getElementById("chatMessages");
const dialogueOptionsList = document.getElementById("dialogueOptionsList");

let matches = [];
let activeChatProfile = null;
const chatHistories = {};
const chatCurrentStep = {};
let countdownInterval = null;

tabDiscover.addEventListener("click", () => {
  tabDiscover.classList.add("active");
  tabMatches.classList.remove("active");
  viewDiscover.classList.add("active");
  viewMatches.classList.remove("active");
});

tabMatches.addEventListener("click", () => {
  tabMatches.classList.add("active");
  tabDiscover.classList.remove("active");
  viewMatches.classList.add("active");
  viewDiscover.classList.remove("active");
  renderMatchesTab();
});

/* ==========================================================
   3. RENDERIZAÇÃO DOS CARDS DE SWIPE
   ========================================================== */
function formatVal(valor) {
  if (valor !== undefined && valor !== null && valor.toString().trim() !== "") {
    return `<span class="value">${valor}</span>`;
  }
  return `<span class="value empty">Não informado</span>`;
}

function renderPerfis() {
  container.innerHTML = "";
  likeBtn.disabled = false;
  nopeBtn.disabled = false;

  perfis.slice().reverse().forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("tinder-card");
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="badge badge-like">MATCH</div>
      <div class="badge badge-nope">PASS</div>

      <div class="card-hero" style="background-image: url('${p.imagem}');">
        <div class="hero-info">
          <h1>${p.nome || "Não informado"}</h1>
          <p>${p.especie || ""} • ${p.planeta || ""}</p>
          <span class="scroll-indicator">↓ Role para ver o perfil completo</span>
        </div>
      </div>

      <div class="profile-content">
        <!-- 01 CADASTRO -->
        <section class="section">
          <div class="section-title"><div class="section-number">01</div><h2>Cadastro</h2></div>
          <div class="answer"><span class="question">Nome</span>${formatVal(p.nome)}</div>
          <div class="answer"><span class="question">Idade relativa</span>${formatVal(p.idade_relativa)}</div>
          <div class="answer"><span class="question">Espécie</span>${formatVal(p.especie)}</div>
          <div class="answer"><span class="question">Sexo / gênero</span>${formatVal(p.genero)}</div>
          <div class="answer"><span class="question">Pronomes</span>${formatVal(p.pronomes)}</div>
          <div class="answer"><span class="question">Planeta - Galáxia</span>${formatVal(p.planeta)}</div>
        </section>

        <!-- 02 OPINIÕES -->
        <section class="section">
          <div class="section-title"><div class="section-number">02</div><h2>Opiniões</h2></div>
          <div class="answer"><span class="question">Linguagem do amor</span>${formatVal(p.linguagem_amor)}</div>
          <div class="answer"><span class="question">Hobby principal</span>${formatVal(p.hobby)}</div>
          <div class="answer"><span class="question">Número de deuses</span>${formatVal(p.deuses)}</div>
          <div class="answer"><span class="question">Número de filhos</span>${formatVal(p.filhos)}</div>
          <div class="answer"><span class="question">Monogamia</span>${formatVal(p.monogamia)}</div>
          <div class="answer"><span class="question">Teletransporte é ético / ainda é você?</span>${formatVal(p.teletransporte_etico)}</div>
        </section>

        <!-- 03 INCOMPATIBILIDADES -->
        <section class="section">
          <div class="section-title"><div class="section-number">03</div><h2>Incompatibilidades</h2></div>
          <div class="answer"><span class="question">Compatibilidade genética</span>${formatVal(p.compatibilidade)}</div>
          <div class="answer"><span class="question">Essa espécie já te usou como pet/cobaia?</span>${formatVal(p.eles_usaram)}</div>
          <div class="answer"><span class="question">Você já usou essa espécie como pet/cobaia?</span>${formatVal(p.eu_usei)}</div>
        </section>
      </div>
    `;

    container.appendChild(card);
    setupCardGestures(card);
  });
}

/* ==========================================================
   4. GESTOS DE SWIPE (TOUCH & MOUSE)
   ========================================================== */
function setupCardGestures(card) {
  let isDragging = false;
  let startX = 0, startY = 0, currentX = 0;
  let isHorizontal = null;

  const likeBadge = card.querySelector(".badge-like");
  const nopeBadge = card.querySelector(".badge-nope");

  card.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    currentX = 0;
    isHorizontal = null;
    card.style.transition = "none";
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    if (isHorizontal === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isHorizontal = Math.abs(diffX) > Math.abs(diffY);
    }
    if (!isHorizontal) return;

    currentX = diffX;
    const rotate = currentX * 0.05;
    card.style.transform = `translate(${currentX}px, 0px) rotate(${rotate}deg)`;

    const opacity = Math.min(Math.abs(currentX) / 100, 1);
    if (currentX > 0) {
      likeBadge.style.opacity = opacity;
      nopeBadge.style.opacity = 0;
    } else {
      nopeBadge.style.opacity = opacity;
      likeBadge.style.opacity = 0;
    }
  });

  const endGesture = () => {
    if (!isDragging) return;
    isDragging = false;
    if (!isHorizontal) return;

    card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    if (currentX > 120) dismiss(card, "right");
    else if (currentX < -120) dismiss(card, "left");
    else {
      card.style.transform = "translate(0px, 0px) rotate(0deg)";
      likeBadge.style.opacity = 0;
      nopeBadge.style.opacity = 0;
    }
  };

  window.addEventListener("pointerup", endGesture);
  window.addEventListener("pointercancel", endGesture);
}

function dismiss(card, direction) {
  const cardId = parseInt(card.dataset.id);
  const profile = perfis.find(p => p.id === cardId);

  const flyDistance = direction === "right" ? 1000 : -1000;
  card.style.transition = "transform 0.4s ease-in, opacity 0.4s ease-in";
  card.style.transform = `translate(${flyDistance}px, 0px) rotate(${direction === "right" ? 25 : -25}deg)`;
  card.style.opacity = "0";

  if (direction === "right" && profile) {
    addMatch(profile);
  }

  setTimeout(() => {
    card.remove();
    checkIfCardsFinished();
  }, 400);
}

function triggerTopCard(direction) {
  const cards = container.querySelectorAll(".tinder-card");
  if (!cards.length) return;
  const topCard = cards[cards.length - 1];
  dismiss(topCard, direction);
}

likeBtn.addEventListener("click", () => triggerTopCard("right"));
nopeBtn.addEventListener("click", () => triggerTopCard("left"));

/* ==========================================================
   5. TELA DE BLOQUEIO 24 HORAS (LOCKOUT)
   ========================================================== */
function checkIfCardsFinished() {
  const remaining = container.querySelectorAll(".tinder-card");
  if (remaining.length === 0) {
    showLockoutScreen();
  }
}

function showLockoutScreen() {
  likeBtn.disabled = true;
  nopeBtn.disabled = true;

  const bgImage = (typeof perfilBloqueadoDeFundo !== "undefined" && perfilBloqueadoDeFundo.imagem)
    ? perfilBloqueadoDeFundo.imagem
    : "assets/images/alien-01.jpg";

  const lockoutEl = document.createElement("div");
  lockoutEl.className = "lockout-card";
  lockoutEl.innerHTML = `
    <div class="lockout-bg" style="background-image: url('${bgImage}');"></div>
    <div class="lockout-overlay"></div>
    
    <div class="lockout-content">
      <div class="lockout-icon">🔒</div>
      <h2>Limite de Sinais Atingido</h2>
      <p>Você explorou todos os seres disponíveis no seu quadrante por hoje.</p>

      <div class="timer-box">
        <div class="time-unit">
          <strong id="timerHours">23</strong>
          <span>Horas</span>
        </div>
        <div class="time-unit">
          <strong id="timerMinutes">59</strong>
          <span>Min</span>
        </div>
        <div class="time-unit">
          <strong id="timerSeconds">59</strong>
          <span>Seg</span>
        </div>
      </div>
      <a href="premium.html" class="premium-button">
          ✦ COMPRAR PREMIUM ✦
        </a>
      <div class="lockout-tag">✦ 1 perfil aguardando descriptografia</div>
    </div>
  `;

  container.appendChild(lockoutEl);
  start24hCountdown();
}

function start24hCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  // 24 horas a partir de agora em segundos
  let totalSeconds = 24 * 60 * 60;

  function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const elH = document.getElementById("timerHours");
    const elM = document.getElementById("timerMinutes");
    const elS = document.getElementById("timerSeconds");

    if (elH && elM && elS) {
      elH.textContent = String(hours).padStart(2, "0");
      elM.textContent = String(minutes).padStart(2, "0");
      elS.textContent = String(seconds).padStart(2, "0");
    }

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      clearInterval(countdownInterval);
      renderPerfis(); // Reinicia quando zerar
    }
  }

  updateDisplay();
  countdownInterval = setInterval(updateDisplay, 1000);
}

/* ==========================================================
   6. LÓGICA DE MATCHES E CHAT COM ALTERNATIVAS
   ========================================================== */
function addMatch(profile) {
  if (!matches.some(m => m.id === profile.id)) {
    matches.push(profile);
    chatCurrentStep[profile.id] = "start";
    
    if (!chatHistories[profile.id]) {
      const startNode = dialogueTrees.default.start;
      chatHistories[profile.id] = [
        { sender: 'them', text: startNode.initialMsg }
      ];
    }

    matchBadge.textContent = matches.length;
    matchBadge.style.display = "inline-block";
  }
}

function renderMatchesTab() {
  matchesHorizontal.innerHTML = "";
  conversationsList.innerHTML = "";

  if (matches.length === 0) {
    conversationsList.innerHTML = `<p style="color: #9a7184; font-size: 14px; text-align: center; margin-top: 40px;">Nenhum match ainda.<br>Arraste para a direita para desbloquear diálogos simulados!</p>`;
    return;
  }

  matches.forEach(p => {
    const matchEl = document.createElement("div");
    matchEl.className = "match-avatar-item";
    matchEl.innerHTML = `
      <div class="match-circle" style="background-image: url('${p.imagem}')"></div>
      <span class="match-name">${p.nome}</span>
    `;
    matchEl.addEventListener("click", () => openChatRoom(p));
    matchesHorizontal.appendChild(matchEl);

    const history = chatHistories[p.id] || [];
    const lastMsg = history.length > 0 ? history[history.length - 1].text : "Começar conversa...";

    const chatItem = document.createElement("div");
    chatItem.className = "chat-item";
    chatItem.innerHTML = `
      <div class="chat-item-avatar" style="background-image: url('${p.imagem}')"></div>
      <div class="chat-item-content">
        <div class="chat-item-name">${p.nome}</div>
        <div class="chat-item-lastmsg">${lastMsg}</div>
      </div>
    `;
    chatItem.addEventListener("click", () => openChatRoom(p));
    conversationsList.appendChild(chatItem);
  });
}

function openChatRoom(profile) {
  activeChatProfile = profile;
  chatListView.style.display = "none";
  chatRoomView.style.display = "flex";

  roomAvatar.style.backgroundImage = `url('${profile.imagem}')`;
  roomName.textContent = profile.nome;
  roomSpecies.textContent = `${profile.especie} • ${profile.planeta}`;

  renderMessages();
  renderDialogueOptions();
}

function renderMessages() {
  chatMessages.innerHTML = "";
  if (!activeChatProfile) return;

  const messages = chatHistories[activeChatProfile.id] || [];
  messages.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${msg.sender === 'me' ? 'message-sent' : 'message-received'}`;
    bubble.textContent = msg.text;
    chatMessages.appendChild(bubble);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderDialogueOptions() {
  dialogueOptionsList.innerHTML = "";
  if (!activeChatProfile) return;

  const stepName = chatCurrentStep[activeChatProfile.id] || "start";
  const stepData = dialogueTrees.default[stepName];

  if (!stepData || !stepData.options || stepData.options.length === 0) {
    dialogueOptionsList.innerHTML = `
      <div class="dialogue-ended-msg">✦ Diálogo encerrado com sucesso diplomático ✦</div>
      <button class="btn-restart-chat" onclick="restartCurrentChat()">Reiniciar conversa artificial</button>
    `;
    return;
  }

  stepData.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "dialogue-option-btn";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => selectDialogueOption(opt));
    dialogueOptionsList.appendChild(btn);
  });
}

function selectDialogueOption(opt) {
  if (!activeChatProfile) return;
  const profileId = activeChatProfile.id;

  chatHistories[profileId].push({ sender: 'me', text: opt.text });
  renderMessages();

  dialogueOptionsList.innerHTML = `<div class="dialogue-hint" style="padding: 10px;">Transmitindo sinal através da malha estelar...</div>`;

  setTimeout(() => {
    chatHistories[profileId].push({ sender: 'them', text: opt.alienReply });
    chatCurrentStep[profileId] = opt.nextStep;
    renderMessages();
    renderDialogueOptions();
  }, 900);
}

window.restartCurrentChat = function() {
  if (!activeChatProfile) return;
  const profileId = activeChatProfile.id;
  chatCurrentStep[profileId] = "start";
  chatHistories[profileId] = [
    { sender: 'them', text: dialogueTrees.default.start.initialMsg }
  ];
  renderMessages();
  renderDialogueOptions();
};

backToChatList.addEventListener("click", () => {
  chatRoomView.style.display = "none";
  chatListView.style.display = "block";
  activeChatProfile = null;
  renderMatchesTab();
});

// Inicialização
renderPerfis();
