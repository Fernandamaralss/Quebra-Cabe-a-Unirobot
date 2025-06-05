const puzzle = document.getElementById("puzzle");
const congratsModal = document.getElementById('congrats-modal');
const congratsMessage = document.getElementById('congrats-message');
const gameOverModal = document.getElementById('game-over-modal');
const gameOverMessage = document.getElementById('game-over-message');


let tempoRestante = 15;
let intervalo = null;
let dragged = null;
let jogoIniciado = false;
let touchDragged = null;

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

    // 🚩 Ajuste dinâmico real
    const puzzleSize = puzzle.clientWidth;
    const pieceSize = Math.floor(puzzleSize / 3);
    const backgroundSize = pieceSize * 3;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const piece = document.createElement("div");
            piece.className = "piece";
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;
            piece.style.backgroundImage = "url('IMG/Unirobozin.svg')";
            piece.style.backgroundSize = `${backgroundSize}px ${backgroundSize}px`;
            piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
            piece.dataset.order = row * 3 + col;
            puzzle.appendChild(piece);
        }
    }


    [...puzzle.children]
        .sort(() => Math.random() - 0.5)
        .forEach(piece => puzzle.appendChild(piece));

    configurarDragAndDrop();
};


// Função de troca genérica
const trocarPecas = (peca1, peca2) => {
    const index1 = [...puzzle.children].indexOf(peca1);
    const index2 = [...puzzle.children].indexOf(peca2);
    if (index1 < index2) {
        puzzle.insertBefore(peca2, peca1);
        puzzle.insertBefore(peca1, puzzle.children[index2]);
    } else {
        puzzle.insertBefore(peca1, peca2);
        puzzle.insertBefore(peca2, puzzle.children[index1]);
    }
};

// Configuração de drag para mouse + touch
const configurarDragAndDrop = () => {
    document.querySelectorAll(".piece").forEach(piece => {
        piece.draggable = true;

        // Eventos de touch
        piece.addEventListener("touchstart", touchStartHandler);
        piece.addEventListener("touchmove", touchMoveHandler);
        piece.addEventListener("touchend", touchEndHandler);
    });

    // Eventos para mouse
    puzzle.addEventListener("dragstart", e => {
        dragged = e.target;
    });

    puzzle.addEventListener("dragover", e => {
        e.preventDefault();
    });

    puzzle.addEventListener("drop", e => {
        e.preventDefault();
        if (e.target.className === "piece" && e.target !== dragged) {
            trocarPecas(dragged, e.target);
            verificarConclusao();
        }
    });
};

// Eventos touch
const touchStartHandler = (e) => {
    touchDragged = e.target;
    e.target.style.zIndex = 1000;
};

const touchMoveHandler = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchDragged.style.position = 'absolute';
    touchDragged.style.left = `${touch.clientX - touchDragged.offsetWidth / 2}px`;
    touchDragged.style.top = `${touch.clientY - touchDragged.offsetHeight / 2}px`;
};

const touchEndHandler = (e) => {
    touchDragged.style.position = 'static';
    touchDragged.style.zIndex = 'auto';

    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && target.className === "piece" && target !== touchDragged) {
        trocarPecas(touchDragged, target);
        verificarConclusao();
    }
    touchDragged = null;
};

// Reiniciar (usado nos botões dos modais)
const voltarParaInicio = () => {
    window.location.href = 'index.html';
};

// Eventos dos botões
document.getElementById("voltarButton").addEventListener('click', voltarParaInicio);
document.getElementById("voltarIndexButton").addEventListener('click', voltarParaInicio);
document.getElementById("voltarIndexButtonOver").addEventListener('click', voltarParaInicio);

// Inicia o jogo após o DOM estar carregado e o layout calculado
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        inicializarQuebraCabeca();
    }, 50);
});

