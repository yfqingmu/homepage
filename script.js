// 轮播图功能
class Carousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".carousel-slide");
    this.dots = document.querySelector(".carousel-dots");
    this.setupDots();
    this.setupControls();
    this.startAutoPlay();
  }

  setupDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => this.goToSlide(index));
      this.dots.appendChild(dot);
    });
  }

  setupControls() {
    document
      .querySelector(".prev")
      .addEventListener("click", () => this.prevSlide());
    document
      .querySelector(".next")
      .addEventListener("click", () => this.nextSlide());
  }

  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove("active");
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add("active");
    this.updateDots();
  }

  prevSlide() {
    const index =
      this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(index);
  }

  nextSlide() {
    const index =
      this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
    this.goToSlide(index);
  }

  startAutoPlay() {
    setInterval(() => this.nextSlide(), 5000);
  }

  updateDots() {
    const dots = this.dots.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  }
}

// AI对话功能
class ChatInterface {
  constructor() {
    this.messages = [
      {
        role: "system",
        content:
          "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。",
      },
    ];
    this.setupEventListeners();
    this.isTyping = false;
  }

  setupEventListeners() {
    const sendBtn = document.querySelector(".send-btn");
    const textarea = document.querySelector(".chat-input textarea");

    sendBtn.addEventListener("click", () => this.sendMessage());
    textarea.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  async sendMessage() {
    if (this.isTyping) return;

    const textarea = document.querySelector(".chat-input textarea");
    const message = textarea.value.trim();

    if (message) {
      // 添加用户消息到界面
      this.addMessage("user", message);
      textarea.value = "";

      // 显示加载状态
      this.isTyping = true;
      const loadingDiv = this.addMessage("ai", "正在思考...");

      try {
        // 使用fetch直接调用API
        const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-G8ZmCGbfDUa1g9CKLgueRqIL9zMhMiqcA8vaCbFiiiGwgXSZ",
          },
          body: JSON.stringify({
            model: "moonshot-v1-8k",
            messages: [...this.messages, { role: "user", content: message }],
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          throw new Error("API请求失败");
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // 清除加载消息
        loadingDiv.remove();

        // 显示AI回复
        this.addMessage("ai", aiResponse);

        // 更新消息历史
        this.messages.push(
          { role: "user", content: message },
          { role: "assistant", content: aiResponse }
        );

        // 更新对话历史列表
        this.updateChatHistory(message, aiResponse);
      } catch (error) {
        console.error("API调用错误:", error);
        loadingDiv.textContent = "抱歉，发生了一些错误，请稍后重试。";
      } finally {
        this.isTyping = false;
      }
    }
  }

  addMessage(type, content) {
    const messagesDiv = document.querySelector(".chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv;
  }

  updateChatHistory(userMessage, aiResponse) {
    const historyList = document.querySelector(".chat-history-list");
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.textContent =
      userMessage.substring(0, 20) + (userMessage.length > 20 ? "..." : "");
    historyList.appendChild(historyItem);
  }
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  new Carousel();
  new ChatInterface();
});
