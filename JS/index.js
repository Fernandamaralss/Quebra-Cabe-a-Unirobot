document.getElementById("startButton").addEventListener("click", () => {
    window.location.href = "quebracabeca.html";
});

document.getElementById("instrucao").addEventListener("click", () => {
    document.getElementById("displayInstruction").style.display = "block";
});

document.getElementById("closeInstruction").addEventListener("click", () => {
    document.getElementById("displayInstruction").style.display = "none";
});
