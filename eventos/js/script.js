const eventoList = []

const Evento = function (titulo, local, vagas, preco, ativo) {
    this.titulo = titulo
    this.local = local
    this.vagas = vagas
    this.preco = preco
    this.ativo = ativo
}

const criarEvento = () => {
    const titulo = document.querySelector("#titulo").value
    const local = document.querySelector("#local").value
    const vagas = document.querySelector("#vagas").value
    const ativo = document.querySelector("#ativo").value
    const preco = parseFloat(document.querySelector("#preco").value)
    const novoEvento = new Evento(titulo, local, vagas, preco, ativo)
    eventoList.push(novoEvento)
}


const carregarLista = () => {
    const listaElemento = document.querySelector("#listaEventos")
    listaElemento.innerHTML = ''
    
    eventoList.forEach((evento, indice) => {
        const itemDiv = document.createElement("div")
        itemDiv.classList.add("evento")
        
        const textoSpan = document.createElement("span")
        textoSpan.textContent = `${evento.titulo} - R$${evento.valor.toFixed(2)}`
        
        const botaoRemover = document.createElement("button")
        botaoRemover.textContent = "Remover"
        botaoRemover.classList.add("btn-remover")
        botaoRemover.onclick = () => removerEvento(indice)
        
        itemDiv.appendChild(textoSpan)
        itemDiv.appendChild(botaoRemover)
        listaElemento.appendChild(itemDiv)
    })
}


const removerDespesa = (indice) => {
    eventoList.splice(indice, 1)
    carregarLista()
}

const botaoAdicionar = document.querySelector("#btnCadastrar")
botaoAdicionar.addEventListener("click", () => {
    const titulo = document.querySelector("#titulo").value.trim()
    const local = document.querySelector("#local").value.trim()
    const vagas = document.querySelector("#vagas").value.trim()
    const ativo = document.querySelector("#ativo").value.trim()
    const valor = parseFloat(document.querySelector("#preco").value)
    
    if (descricao && !isNaN(valor) && valor > 0) {
        criarEvento()
        carregarLista()
        
        
       
        document.querySelector("#titulo").value = ""
        document.querySelector("#local").value = ""
        document.querySelector("#vagas").value = ""
        document.querySelector("#ativo").value = ""
        document.querySelector("#preco").value = ""
    } else {
        alert("Por favor, preencha os valores")
    }
})