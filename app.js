const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
const commandList = document.getElementById("command-list");
const sideMenu = document.getElementById("sideMenu");
const menuButton = document.getElementById("menu-button");

let voices = [];
let alarms = [];
const events = [];

// Lista de comandos disponíveis
const commands = [
  { trigger: "olá", description: "Saudar o usuário" },
  { trigger: "abrir google", description: "Abrir Google" },
  { trigger: "abrir youtube", description: "Abrir YouTube" },
  { trigger: "abrir facebook", description: "Abrir Facebook" },
  { trigger: "abrir calendario", description: "Abrir Google Calendar" },
  { trigger: "o que é", description: "Buscar no Google" },
  { trigger: "quem é", description: "Buscar no Google" },
  { trigger: "o que são", description: "Buscar no Google" },
  { trigger: "wikipedia", description: "Buscar na Wikipedia" },
  { trigger: "hora", description: "Mostrar a hora atual" },
  { trigger: "data", description: "Mostrar a data atual" },
  { trigger: "calculadora", description: "Abrir calculadora" },
  { trigger: "notícias", description: "Abrir notícias" },
  { trigger: "contar piada", description: "Contar uma piada" },
  { trigger: "clima", description: "Obter o clima" },
  { trigger: "definir", description: "Buscar definição de palavra" },
  { trigger: "adicionar evento", description: "Adicionar um evento à agenda" },
  { trigger: "listar eventos", description: "Listar eventos da agenda" },
  { trigger: "tocar música", description: "Tocar uma música" },
  { trigger: "definir lembrete", description: "Definir um lembrete" },
  { trigger: "evento histórico", description: "Obter um evento histórico" },
  { trigger: "buscar youtube", description: "Buscar no YouTube" },
  { trigger: "recomendar filme", description: "Recomendar um filme" },
];

// Função para preencher a lista de comandos
function populateCommandList() {
  commandList.innerHTML = "";
  commands.forEach((command) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${command.trigger}: ${command.description}`;
    commandList.appendChild(listItem);
  });
}

// Função para alternar o menu lateral
function toggleMenu() {
  sideMenu.classList.toggle("active");
}

// Função para abrir um site
function openWebsite(url, responseText) {
  window.open(url, "_blank");
  speak(responseText);
}

// Popula a lista de vozes disponíveis
function populateVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach((voice, index) =>
    console.log(`${index}: ${voice.name} (${voice.lang})`)
  );
}

// Função para falar o texto
function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;
  text_speak.voice = voices.find((voice) => voice.lang === "pt-BR"); // Voz em português
  window.speechSynthesis.speak(text_speak);
}

// Função para desejar um bom dia, tarde ou noite
function wishMe() {
  const day = new Date();
  const hour = day.getHours();
  if (hour >= 0 && hour < 12) {
    speak("Bom dia, chefe...");
  } else if (hour >= 12 && hour < 17) {
    speak("Boa tarde, mestre...");
  } else {
    speak("Boa noite, senhor...");
  }
}

// Função para obter o clima atual
function getWeather() {
  const apiKey = "0fc113aaeb43c1e9c619b65ab9b1e7f6"; // Substitua com sua chave de API
  const city = "Uruguaiana"; // Você pode modificar isso para a cidade desejada
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`
  )
    .then((response) => response.json())
    .then((data) => {
      const temp = data.main.temp;
      const weather = data.weather[0].description;
      speak(
        `A temperatura atual em ${city} é de ${temp} graus Celsius com ${weather}.`
      );
    })
    .catch((error) => {
      console.error("Erro ao obter o clima:", error);
      speak("Desculpe, não consegui obter o clima no momento.");
    });
}

// Função para definir um alarme
function setAlarm(time) {
  alarms.push(time);
  speak(`Alarme definido para ${time}.`);
}

// Função para executar cálculos simples
function performCalculation(message) {
  const expression = message.replace("calcular", "").trim();
  try {
    const result = eval(expression);
    speak(`O resultado é ${result}.`);
  } catch (error) {
    speak("Desculpe, não consegui realizar o cálculo.");
  }
}

// Função para buscar definições de palavras
function defineWord(word) {
  const apiKey = "YOUR_API_KEY"; // Substitua com sua chave de API do Wordnik
  fetch(
    `https://api.wordnik.com/v4/word.json/${word}/definitions?api_key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const definition = data[0].text;
        speak(`A definição de ${word} é: ${definition}`);
      } else {
        speak(`Não consegui encontrar a definição para ${word}.`);
      }
    })
    .catch((error) => {
      console.error("Erro ao obter definição:", error);
      speak("Desculpe, não consegui obter a definição.");
    });
}

// Função para adicionar eventos à agenda
function addEvent(event) {
  events.push(event);
  speak(`Evento adicionado: ${event}`);
}

// Função para listar eventos da agenda
function listEvents() {
  if (events.length > 0) {
    const eventList = events.join(", ");
    speak(`Seus eventos são: ${eventList}`);
  } else {
    speak("Você não tem eventos na sua agenda.");
  }
}

// Função para buscar vídeos no YouTube
function searchYouTube(query) {
    const apiKey = "AIzaSyD7nfjtg4MsQOKUy2ReLKmyt4shVMIgSA8 "; // Substitua com sua chave de API do YouTube
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items.length > 0) {
          const video = data.items[0];
          const videoTitle = video.snippet.title;
          const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
          speak(`Encontrei o vídeo da música: ${videoTitle}. Vou abrir para você.`);
          window.open(videoUrl, "_blank");
        } else {
          speak(`Não encontrei nenhum vídeo para ${query} no YouTube.`);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar vídeos:", error);
        speak("Desculpe, não consegui buscar vídeos no YouTube.");
      });
  }
  
  // Função para tocar música
  function playMusic(query) {
    searchYouTube(query);
  }
  

// Função para contar uma piada
function tellJoke() {
  const jokes = [
    "Por que o computador foi ao médico? Porque ele estava com um vírus!",
    "O que o zero disse para o oito? Que cinto bonito!",
    "Por que o livro de matemática se suicidou? Porque tinha muitos problemas.",
  ];
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  speak(joke);
}

// Função para definir um lembrete
function setReminder(time, message) {
  // Exemplo simplificado: apenas exibe o lembrete, não envia notificação real
  speak(`Lembrete definido para ${time}: ${message}`);
}

// Função para obter informações sobre um evento histórico
function getHistoricalEvent(date) {
  const url = `https://history.muffinlabs.com/date/${date}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const events = data.data.Events;
      if (events.length > 0) {
        const event = events[0].text;
        speak(`Em ${date}, aconteceu: ${event}`);
      } else {
        speak(`Não encontrei eventos históricos para a data ${date}.`);
      }
    })
    .catch((error) => {
      console.error("Erro ao obter evento histórico:", error);
      speak(
        "Desculpe, não consegui obter informações sobre eventos históricos."
      );
    });
}

// Função para buscar vídeos no YouTube
function searchYouTube(query) {
  const apiKey = "YOUR_YOUTUBE_API_KEY"; // Substitua com sua chave de API do YouTube
  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.items.length > 0) {
        const video = data.items[0];
        const videoTitle = video.snippet.title;
        const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        speak(
          `Encontrei um vídeo no YouTube: ${videoTitle}. Vou abrir para você.`
        );
        openWebsite(videoUrl, `Abrindo o vídeo: ${videoTitle}`);
      } else {
        speak(`Não encontrei vídeos para ${query} no YouTube.`);
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar vídeos:", error);
      speak("Desculpe, não consegui buscar vídeos no YouTube.");
    });
}

// Função para recomendar filmes usando a API do TMDb
function recommendMovie() {
  const apiKey = "YOUR_TMDB_API_KEY"; // Substitua com sua chave de API do TMDb
  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        const movie = data.results[0];
        const movieTitle = movie.title;
        const movieOverview = movie.overview;
        speak(
          `Recomendo o filme ${movieTitle}. Sinopse: ${movieOverview}.`
        );
      } else {
        speak("Não consegui encontrar recomendações de filmes.");
      }
    })
    .catch((error) => {
      console.error("Erro ao recomendar filmes:", error);
      speak("Desculpe, não consegui recomendar um filme.");
    });
}

// Função para processar comandos de voz
function takeCommand(command) {
  if (command.includes("olá")) {
    speak("Olá! Como posso ajudar você hoje?");
  } else if (command.includes("abrir google")) {
    openWebsite("https://www.google.com", "Abrindo Google");
  } else if (command.includes("abrir youtube")) {
    openWebsite("https://www.youtube.com", "Abrindo YouTube");
  } else if (command.includes("abrir facebook")) {
    openWebsite("https://www.facebook.com", "Abrindo Facebook");
  } else if (command.includes("abrir calendario")) {
    openWebsite("https://calendar.google.com", "Abrindo Google Calendar");
  } else if (command.includes("hora")) {
    const now = new Date();
    const time = now.toLocaleTimeString();
    speak(`A hora atual é ${time}`);
  } else if (command.includes("data")) {
    const now = new Date();
    const date = now.toLocaleDateString();
    speak(`A data de hoje é ${date}`);
  } else if (command.includes("calculadora")) {
    openWebsite("https://www.calculadora.com.br", "Abrindo Calculadora");
  } else if (command.includes("notícias")) {
    openWebsite("https://www.bbc.com/portuguese", "Abrindo Notícias");
  } else if (command.includes("contar piada")) {
    tellJoke();
  } else if (command.includes("clima")) {
    getWeather();
  } else if (command.includes("definir")) {
    const word = command.replace("definir", "").trim();
    defineWord(word);
  } else if (command.includes("adicionar evento")) {
    const event = command.replace("adicionar evento", "").trim();
    addEvent(event);
  } else if (command.includes("listar eventos")) {
    listEvents();
  } else if (command.includes("tocar música")) {
    const url = "YOUR_MUSIC_URL"; // Substitua com a URL da música
    playMusic(url);
  } else if (command.includes("definir lembrete")) {
    const [time, ...messageParts] = command.replace("definir lembrete", "").trim().split(" ");
    const message = messageParts.join(" ");
    setReminder(time, message);
  } else if (command.includes("evento histórico")) {
    const date = command.replace("evento histórico", "").trim();
    getHistoricalEvent(date);
  } else if (command.includes("buscar youtube")) {
    const query = command.replace("buscar youtube", "").trim();
    searchYouTube(query);
  } else if (command.includes("recomendar filme")) {
    recommendMovie();
  } else {
    speak("Desculpe, não entendi o comando.");
  }
}

// Inicializa o assistente
window.addEventListener("load", () => {
  speechSynthesis.addEventListener("voiceschanged", populateVoices);
  speak("Inicializando JARVIS...");
  wishMe();
  populateCommandList(); // Preenche a lista de comandos ao carregar a página
});

// Configura o reconhecimento de fala
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "pt-BR"; // Define o idioma para português

recognition.onstart = () => {
  content.textContent = "Escutando...";
};

recognition.onresult = (event) => {
  const transcript = event.results[event.resultIndex][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
};

recognition.onerror = (event) => {
  console.error("Erro no reconhecimento de fala:", event.error);
  speak("Desculpe, não consegui entender. Pode repetir, por favor?");
};

// Inicia o reconhecimento de fala ao clicar no botão
btn.addEventListener("click", () => {
  recognition.start();
});

// Adiciona funcionalidade ao botão de menu
menuButton.addEventListener("click", toggleMenu);
