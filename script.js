const textarea = document.querySelector("textarea");
const button = document.querySelector("button");
const languageSelect = document.querySelector("#language-select"); // Assumindo que você adicionará um select para idiomas
let isSpeaking = false;

const textToSpeech = () => {
  const synth = window.speechSynthesis;
  const text = textarea.value;
  
  // Parar qualquer fala existente
  if (synth.speaking) {
    synth.cancel();
  }
  
  if (text) {
    // Criar a utterance com o texto
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar o idioma selecionado (se existir um select de idioma)
    if (languageSelect) {
      utterance.lang = languageSelect.value;
    } else {
      // Alguns códigos de idioma comuns - você pode adicionar mais conforme necessário
      // 'pt-BR' para português brasileiro, 'es-ES' para espanhol, etc.
      utterance.lang = 'pt-BR'; // Definindo português brasileiro como padrão
    }
    
    // Configuração opcional de voz
    // Você pode escolher uma voz específica, se disponível
    const voices = synth.getVoices();
    const selectedVoice = voices.find(voice => voice.lang === utterance.lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Eventos para controlar o estado do botão
    utterance.onstart = () => {
      isSpeaking = true;
      button.innerText = "Pausar";
    };
    
    utterance.onend = () => {
      isSpeaking = false;
      button.innerText = "Converter para Fala";
    };
    
    utterance.onpause = () => {
      isSpeaking = false;
      button.innerText = "Continuar";
    };
    
    utterance.onresume = () => {
      isSpeaking = true;
      button.innerText = "Pausar";
    };
    
    // Iniciar a fala
    synth.speak(utterance);
  }
};

// Função para alternar entre pausar e continuar
const toggleSpeech = () => {
  const synth = window.speechSynthesis;
  
  if (!textarea.value) return;
  
  if (synth.speaking) {
    if (synth.paused) {
      synth.resume();
      button.innerText = "Pausar";
    } else {
      synth.pause();
      button.innerText = "Continuar";
    }
  } else {
    textToSpeech();
  }
};

// Carregar vozes disponíveis quando o navegador estiver pronto
window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  
  // Se você quiser mostrar as vozes disponíveis em um select
  if (languageSelect) {
    const uniqueLanguages = [...new Set(voices.map(voice => voice.lang))];
    
    uniqueLanguages.forEach(lang => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = `${lang} - ${voices.find(voice => voice.lang === lang).name}`;
      languageSelect.appendChild(option);
    });
  }
};

// Inicializar as vozes
window.speechSynthesis.getVoices();

// Event listener para o botão
button.addEventListener("click", toggleSpeech);