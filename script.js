// =====================================================
// JOGO DA VELHA - meu primeiro jogo em JS :)
// =====================================================

// Onde salvar os dados? Anotacao pra eu lembrar:
// - localStorage: fica salvo no navegador PRA SEMPRE (ate eu apagar).
//   Fecha o navegador, abre de novo e ta la. <- usei esse!
// - sessionStorage: igualzinho o localStorage (mesmos comandos),
//   mas some quando fecha a aba.
// - cookies: tambem ficam salvos, mas vao junto pro servidor em toda
//   requisicao, tem tamanho pequeno (~4kb) e sao chatos de ler no JS
//   (document.cookie vira uma string "a=1; b=2"). Abrindo o arquivo
//   direto (file://) as vezes nem funciona.

// variaveis do jogo
var tabuleiro = ["", "", "", "", "", "", "", "", ""];
var vez = "X";
var quemComeca = "X";
var jogoAcabou = false;
var placar = { X: 0, O: 0, empate: 0 };
var nome1 = "";
var nome2 = "";
var modo = "computador";

// todas as linhas que dao vitoria
var linhasVencedoras = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6]             // diagonais
];

// pegando os elementos do html
var telaConfig = document.getElementById("config");
var telaJogo = document.getElementById("jogo");
var form = document.getElementById("form-config");
var inputNome1 = document.getElementById("nome1");
var inputNome2 = document.getElementById("nome2");
var selectModo = document.getElementById("modo");
var campoNome2 = document.getElementById("campo-nome2");
var textoPlacar = document.getElementById("placar");
var textoMensagem = document.getElementById("mensagem");
var casas = document.querySelectorAll(".casa");

// ---------- salvar e carregar ----------

function salvarDados() {
  localStorage.setItem("nome1", nome1);
  localStorage.setItem("nome2", nome2);
  localStorage.setItem("modo", modo);
  localStorage.setItem("quemComeca", quemComeca);
  // localStorage so guarda texto, entao o objeto vira JSON
  localStorage.setItem("placar", JSON.stringify(placar));
}

function carregarDados() {
  var nomeSalvo = localStorage.getItem("nome1");

  if (nomeSalvo) {
    nome1 = nomeSalvo;
    nome2 = localStorage.getItem("nome2");
    modo = localStorage.getItem("modo");
    quemComeca = localStorage.getItem("quemComeca") || "X";

    var placarSalvo = localStorage.getItem("placar");
    if (placarSalvo) {
      placar = JSON.parse(placarSalvo);
    }

    // ja tem tudo salvo, vai direto pro jogo
    mostrarJogo();
  }
}

// ---------- telas ----------

function mostrarJogo() {
  telaConfig.classList.add("escondido");
  telaJogo.classList.remove("escondido");
  novaPartida();
}

function mostrarConfig() {
  telaJogo.classList.add("escondido");
  telaConfig.classList.remove("escondido");
}

// mostra/esconde o campo do jogador 2
selectModo.addEventListener("change", function () {
  if (selectModo.value == "dupla") {
    campoNome2.classList.remove("escondido");
  } else {
    campoNome2.classList.add("escondido");
  }
});

form.addEventListener("submit", function iniciarJogoConfigurado(evento) {
  evento.preventDefault(); // pra pagina nao recarregar

  nome1 = inputNome1.value.trim();
  modo = selectModo.value;

  if (nome1 == "") {
    alert("Digite o nome do jogador 1!");
    return;
  }

  if (modo == "dupla") {
    nome2 = inputNome2.value.trim();
    if (nome2 == "") {
      alert("Digite o nome do jogador 2!");
      return;
    }
  } else {
    nome2 = "Computador";
  }

  placar = { X: 0, O: 0, empate: 0 };
  quemComeca = "X";
  salvarDados();
  mostrarJogo();
})

// ---------- o jogo ----------

function nomeDe(simbolo) {
  if (simbolo == "X") {
    return nome1;
  } else {
    return nome2;
  }
}

function novaPartida() {
  tabuleiro = ["", "", "", "", "", "", "", "", ""];
  jogoAcabou = false;
  vez = quemComeca;
  textoMensagem.innerText = "Vez de " + nomeDe(vez) + " (" + vez + ")";
  desenhar();

  if (vezDoComputador()) {
    setTimeout(jogadaComputador, 500);
  }
}

function vezDoComputador() {
  return modo == "computador" && vez == "O" && !jogoAcabou;
}

function desenhar() {
  for (var i = 0; i < casas.length; i++) {
    casas[i].innerText = tabuleiro[i];
  }
  textoPlacar.innerText =
    nome1 + " (X): " + placar.X +
    " | " + nome2 + " (O): " + placar.O +
    " | Empates: " + placar.empate;
}

function jogar(i) {
  tabuleiro[i] = vez;

  var vencedor = verificarVencedor();
  if (vencedor != "") {
    fimDeJogo(vencedor);
    desenhar();
    return;
  }

  // troca a vez
  if (vez == "X") {
    vez = "O";
  } else {
    vez = "X";
  }
  textoMensagem.innerText = "Vez de " + nomeDe(vez) + " (" + vez + ")";
  desenhar();

  if (vezDoComputador()) {
    setTimeout(jogadaComputador, 500);
  }
}

function clicarCasa(i) {
  if (jogoAcabou) return;
  if (tabuleiro[i] != "") return;
  if (vezDoComputador()) return; // espera o computador

  jogar(i);
}

// retorna "X", "O", "empate" ou "" (ninguem ainda)
function verificarVencedor() {
  for (var i = 0; i < linhasVencedoras.length; i++) {
    var a = linhasVencedoras[i][0];
    var b = linhasVencedoras[i][1];
    var c = linhasVencedoras[i][2];

    if (tabuleiro[a] != "" && tabuleiro[a] == tabuleiro[b] && tabuleiro[a] == tabuleiro[c]) {
      return tabuleiro[a];
    }
  }

  // se nao tem casa vazia, deu velha
  if (tabuleiro.indexOf("") == -1) {
    return "empate";
  }

  return "";
}

function fimDeJogo(resultado) {
  jogoAcabou = true;

  if (resultado == "empate") {
    placar.empate++;
    textoMensagem.innerText = "Deu velha!";
    // no empate alterna quem comeca
    if (quemComeca == "X") {
      quemComeca = "O";
    } else {
      quemComeca = "X";
    }
  } else {
    placar[resultado]++;
    textoMensagem.innerText = nomeDe(resultado) + " ganhou!!!";
    // quem ganhou comeca a proxima
    quemComeca = resultado;
  }

  salvarDados();
}

function jogadaComputador() {
  if (jogoAcabou) return;

  // junta as casas vazias
  var vazias = [];
  for (var i = 0; i < tabuleiro.length; i++) {
    if (tabuleiro[i] == "") {
      vazias.push(i);
    }
  }

  // escolhe uma aleatoria
  var sorteada = vazias[Math.floor(Math.random() * vazias.length)];
  jogar(sorteada);
}

// ---------- botoes ----------

for (var i = 0; i < casas.length; i++) {
  casas[i].addEventListener("click", function () {
    var indice = Number(this.getAttribute("data-i"));
    clicarCasa(indice);
  });
}

document.getElementById("btn-de-novo").addEventListener("click", function () {
  novaPartida();
});

document.getElementById("btn-zerar").addEventListener("click", function () {
  if (confirm("Quer mesmo zerar o placar?")) {
    placar = { X: 0, O: 0, empate: 0 };
    quemComeca = "X";
    salvarDados();
    novaPartida();
  }
});

document.getElementById("btn-trocar").addEventListener("click", function () {
  localStorage.removeItem("nome1");
  localStorage.removeItem("nome2");
  localStorage.removeItem("modo");
  localStorage.removeItem("quemComeca");
  localStorage.removeItem("placar");
  inputNome1.value = "";
  inputNome2.value = "";
  mostrarConfig();
});

// quando abre a pagina
carregarDados();
