// Função executada quando o DOM é carregado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do conselho
    const adviceElement = document.getElementById('advice');
    const getAdviceBtn = document.getElementById('getAdviceBtn');
    const adviceCategory = document.getElementById('adviceCategory');

    // Evento ao clicar na categoria de conselho
    adviceCategory.addEventListener('click', function() {
        // Exibir contêiner de conselho e ocultar contêiner de pergunta
        document.querySelector('.advice-container').style.display = 'block';
        document.querySelector('.question-container').style.display = 'none';
        // Exibir botão "Nova Pergunta"
        document.querySelector('#getQuestionBtn').style.display = 'block';
        // Alterar o plano de fundo
        document.body.style.backgroundImage = "url('https://wallpaper.dog/large/5531170.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.opacity = "0.9";
        // Exibir botão de obter conselho
        getAdviceBtn.style.display = 'block';
        // Limpar e ocultar o campo de conselho
        adviceElement.textContent = '';
        adviceElement.style.display = 'none';
    });

    // Evento ao clicar no botão de obter conselho
    getAdviceBtn.addEventListener('click', function() {
        // Obter conselho da API
        fetch('https://api.adviceslip.com/advice')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível obter os dados');
                }
                return response.json();
            })
            .then(data => {
                // Exibir conselho traduzido
                const advice = data.slip.advice;
                translateText(advice, 'pt', 'en')
                    .then(translatedAdvice => {
                        adviceElement.textContent = translatedAdvice;
                        adviceElement.style.display = 'inline-block';
                        getAdviceBtn.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Erro na tradução:', error);
                        adviceElement.textContent = advice;
                        adviceElement.style.display = 'inline-block';
                        getAdviceBtn.style.display = 'none';
                    });
            })
            .catch(error => {
                console.error('Erro ao obter conselho:', error);
            });
    });

    // Elementos da pergunta
    const questionElement = document.getElementById('question');
    const getQuestionBtn = document.getElementById('getQuestionBtn');
    const questionCategory = document.getElementById('questionCategory');
    const trueBtn = document.getElementById('trueBtn');
    const falseBtn = document.getElementById('falseBtn');
    const answerElement = document.getElementById('answer');

    // Evento ao clicar na categoria de pergunta
    questionCategory.addEventListener('click', function() {
        // Exibir contêiner de pergunta e ocultar contêiner de conselho
        document.querySelector('.question-container').style.display = 'block';
        document.querySelector('.advice-container').style.display = 'none';
        // Exibir botão "Nova Pergunta"
        document.querySelector('#getQuestionBtn').style.display = 'block';
        // Alterar o plano de fundo
        document.body.style.backgroundImage = "url('https://assets-global.website-files.com/5bb9339024337ca51e2eb44f/5e85e815faa6ea5054bed166_Frequently%20Asked%20Questions.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.opacity = "0.9";
        // Ocultar botões de resposta
        trueBtn.style.display = 'none';
        falseBtn.style.display = 'none';
        // Limpar e ocultar campos de pergunta e resposta
        answerElement.textContent = '';
        questionElement.textContent = '';
        questionElement.style.display = 'none';
        answerElement.style.display = 'none';
    });

    // Evento ao clicar no botão de obter pergunta
    getQuestionBtn.addEventListener('click', function() {
        // Obter pergunta da API
        fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível obter os dados');
                }
                return response.json();
            })
            .then(data => {
                // Exibir pergunta traduzida
                let question = decodeEntities(data.results[0].question);
                question = question.slice(0, -1) + "?"; // Adicionar ponto de interrogação
                translateText(question, 'pt', 'en')
                    .then(translatedQuestion => {
                        questionElement.innerHTML = translatedQuestion;
                        questionElement.style.display = 'inline-block';
                        getQuestionBtn.style.display = 'none';
                        trueBtn.style.display = 'inline-block';
                        falseBtn.style.display = 'inline-block';
                        // Ocultar campo de resposta ao obter nova pergunta
                        answerElement.textContent = '';
                        answerElement.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Erro na tradução:', error);
                        questionElement.textContent = question;
                        getQuestionBtn.style.display = 'none';
                        trueBtn.style.display = 'inline-block';
                        falseBtn.style.display = 'inline-block';
                    });
            })
            .catch(error => {
                console.error('Erro ao obter pergunta:', error);
            });
    });

    // Evento ao clicar no botão Verdadeiro
    trueBtn.addEventListener('click', function() {
        checkAnswer(true);
        // Ocultar botões de resposta após responder
        trueBtn.style.display = 'none';
        falseBtn.style.display = 'none';
    });

    // Evento ao clicar no botão Falso
    falseBtn.addEventListener('click', function() {
        checkAnswer(false);
        // Ocultar botões de resposta após responder
        trueBtn.style.display = 'none';
        falseBtn.style.display = 'none';
    });

    // Função para verificar a resposta
    function checkAnswer(userAnswer) {
        const correctAnswer = questionElement.textContent.toLowerCase().includes("true");
        const isCorrect = (correctAnswer && userAnswer) || (!correctAnswer && !userAnswer);
        // Exibir mensagem de resposta
        answerElement.textContent = isCorrect ? 'Você acertou!' : 'Você errou!';
        answerElement.style.display = 'inline-block';
    }

    // Função para traduzir texto
    async function translateText(text, targetLang, sourceLang) {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURI(text)}&langpair=${sourceLang}|${targetLang}`);
        const data = await response.json();
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Erro na tradução');
        }
    }

    // Função para decodificar entidades HTML
    function decodeEntities(encodedString) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = encodedString;
        return textarea.value;
    }
});
