const puzzle = document.getElementById("puzzle");
const congratsModal = document.getElementById('congrats-modal');
const congratsMessage = document.getElementById('congrats-message');
const gameOverModal = document.getElementById('game-over-modal');
const gameOverMessage = document.getElementById('game-over-message');

let tempoRestante = 15;
let intervalo = null;
let dragged = null;
let jogoIniciado = false;

// Formatar tempo
const formatarTempo = (segundos) => {
    segundos = Math.max(0, segundos);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes.toString().padStart(2, '0')}`;
};

// Atualizar o tempo
const atualizarTempo = () => {
    tempoRestante--;
    document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);
    if (tempoRestante <= 0) {
        pararTempo();
        mostrarGameOver();
    }
};

// Iniciar o tempo
const iniciarTempo = () => {
    document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);
    intervalo = setInterval(atualizarTempo, 1000);
};

// Parar tempo
const pararTempo = () => {
    clearInterval(intervalo);
    intervalo = null;
};

// Verificar se o quebra-cabeça foi resolvido
const verificarConclusao = () => {
    const pecas = [...puzzle.children];
    const correto = pecas.every((piece, index) => Number(piece.dataset.order) === index);
    if (correto) {
        pararTempo();
        mostrarParabens();
    }
};

// Mostrar parabéns
const mostrarParabens = () => {
    congratsMessage.textContent = `Você resolveu o quebra-cabeça em ${formatarTempo(15 - tempoRestante)}!`;
    congratsModal.style.display = 'block';
    puzzle.style.pointerEvents = 'none';
};

// Mostrar Game Over
const mostrarGameOver = () => {
    gameOverMessage.textContent = "Tempo esgotado! Tente novamente.";
    gameOverModal.style.display = 'block';
    puzzle.style.pointerEvents = 'none';
};

// Inicializar o quebra-cabeça
const inicializarQuebraCabeca = () => {
    puzzle.innerHTML = '';
    tempoRestante = 15;
    jogoIniciado = true;
    puzzle.style.pointerEvents = 'auto';
    iniciarTempo();

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const piece = document.createElement("div");
            piece.className = "piece";
            piece.style.backgroundPosition = `-${col * 150}px -${row * 150}px`;
            piece.dataset.order = row * 3 + col;
            puzzle.appendChild(piece);
        }
    }

    [...puzzle.children]
        .sort(() => Math.random() - 0.5)
        .forEach(piece => puzzle.appendChild(piece));

    configurarDragAndDrop();
};

// Drag and Drop
const configurarDragAndDrop = () => {
    document.querySelectorAll(".piece").forEach(piece => {
        piece.draggable = true;
    });

    puzzle.addEventListener("dragstart", e => {
        dragged = e.target;
    });

    puzzle.addEventListener("dragover", e => {
        e.preventDefault();
    });

    puzzle.addEventListener("drop", e => {
        e.preventDefault();
        if (e.target.className === "piece" && e.target !== dragged) {
            const draggedIndex = [...puzzle.children].indexOf(dragged);
            const targetIndex = [...puzzle.children].indexOf(e.target);
            puzzle.insertBefore(dragged, puzzle.children[targetIndex]);
            puzzle.insertBefore(e.target, puzzle.children[draggedIndex]);

            verificarConclusao();
        }
    });
};

// Reiniciar (usado nos botões dos modais)
const voltarParaInicio = () => {
    // Aqui você pode redirecionar para a página inicial
    window.location.href = 'index.html';
};

// Adiciona eventos nos botões
document.getElementById("voltarButton").addEventListener('click', voltarParaInicio);
document.getElementById("voltarIndexButton").addEventListener('click', voltarParaInicio);
document.getElementById("voltarIndexButtonOver").addEventListener('click', voltarParaInicio);

// Inicia o jogo ao carregar a página
window.addEventListener('load', () => {
    inicializarQuebraCabeca();
});
