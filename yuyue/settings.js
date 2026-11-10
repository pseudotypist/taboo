/*
 * BURADAN DÜZENLE
 * Metinleri tırnakların içinde değiştir. Satır sonundaki virgülleri koru.
 * {name} yazan yerlere recipientName otomatik olarak yerleştirilir.
 */
window.LOVE_LETTER = {
  recipientName: "于悦",
  correctAnswer: "erdem", // Büyük/küçük harf ve baştaki/sondaki boşluklar önemsenmez.
  finalMessage: "love you, beautiful!",
  signature: "Erdem",

  copy: {
    pageTitle: "有一封信，只写给{name}",
    address: "致 {name}",
    stamp: "只给你",
    introEyebrow: "有一件小事，想悄悄告诉你",
    introTitle: "有一封信，\n只想交给你。",
    introNote: "不过，这封信只能由你亲手打开。",
    openButton: "如果你是{name}，就点这里",
    introFooter: "请把这一点点好奇心，留给我。",
    confirmTitle: "真的是你吗？",
    confirmNote: "我要再确认一下，这份心意有没有送对人。",
    yesButton: "是我呀",
    closeDialog: "关闭",
    challengeEyebrow: "那就证明给我看吧",
    question: "世界上最帅的男人叫什么名字？",
    inputLabel: "他的名字是……",
    inputPlaceholder: "请输入他的名字",
    answerButton: "确认答案",
    challengeNote: "这道题，你一定知道答案。",
    wrongAnswer: "我的大傻子，你一定知道的 💕",
    emptyAnswer: "先写下他的名字吧 💗",
    finalEyebrow: "有句话，只想对{name}说",
  },

  // İstersen renkleri buradan değiştirebilirsin.
  theme: {
    background: "#fff8f3",
    ink: "#55313c",
    accent: "#bd4265",
    accentDark: "#a63859",
  },

  // Doğru cevaptan sonraki kalp yağmuru. Yazı animasyon bitince ekranda kalır.
  hearts: {
    count: 96,
    durationMs: 10000,
    colors: ["#c64d6e", "#e78ba3", "#eeb4bf", "#ac3d62", "#f0c6cb"],
  },
};
