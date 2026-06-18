const eventoList = []

const Evento = function (titulo, local, vagas, preco, data, ativo, observacao = undefined, cancelamento = null) {
    this.titulo = titulo
    this.local = local
    this.vagas = Number(vagas)
    this.preco = preco
    this.data = data
    this.ativo = ativo
    this.observacao = observacao
    this.cancelamento = cancelamento
}

const criarEvento = (titulo, local, vagas, preco, data, ativo, observacao, cancelamento) => {
    const novoEvento = new Evento(titulo, local, vagas, preco, data, ativo, observacao, cancelamento)
    eventoList.push(novoEvento)
}

const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

const carregarLista = () => {
    const listaElemento = document.querySelector('#listaEventos')
    listaElemento.innerHTML = ''
    const filtroStatus = document.querySelector('#filtroStatus')
    const statusSelecionado = filtroStatus ? filtroStatus.value : 'todos'

    const eventosParaExibir = eventoList.filter((evento) => {
        if (statusSelecionado === 'ativos') {
            return evento.ativo
        }
        if (statusSelecionado === 'inativos') {
            return !evento.ativo
        }
        return true
    })

    if (eventosParaExibir.length === 0) {
        listaElemento.innerHTML = '<p>Nenhum evento cadastrado ainda.</p>'
        atualizarEstatisticas(eventosParaExibir.length)
        return
    }

    eventosParaExibir.forEach((evento, indice) => {
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('evento')

        const tituloEl = document.createElement('h3')
        tituloEl.textContent = evento.titulo

        const detalhesEl = document.createElement('p')
        const status = evento.ativo ? 'Ativo' : 'Inativo'
        const dataTexto = evento.data ? formatarData(evento.data) : 'Data inválida'
        detalhesEl.textContent = `${evento.local} | ${dataTexto} | ${evento.vagas} vagas | ${formatarPreco(evento.preco)} | ${status}`

        const observacaoEl = document.createElement('p')
        observacaoEl.textContent = evento.observacao === undefined || evento.observacao === ''
            ? 'Observação: não possui observações cadastradas.'
            : `Observação: ${evento.observacao}`

        itemDiv.appendChild(tituloEl)
        itemDiv.appendChild(detalhesEl)
        itemDiv.appendChild(observacaoEl)

        if (evento.cancelamento !== null) {
            const cancelamentoEl = document.createElement('p')
            cancelamentoEl.textContent = `Evento cancelado. Motivo: ${evento.cancelamento}`
            cancelamentoEl.classList.add('cancelamento')
            itemDiv.appendChild(cancelamentoEl)
        }

        const botaoRemover = document.createElement('button')
        botaoRemover.textContent = 'Remover'
        botaoRemover.classList.add('btn-remover')
        botaoRemover.onclick = () => removerEvento(indice)

        itemDiv.appendChild(botaoRemover)
        listaElemento.appendChild(itemDiv)
    })

    atualizarEstatisticas(eventosParaExibir.length)
}

const removerEvento = (indice) => {
    eventoList.splice(indice, 1)
    carregarLista()
}

const atualizarEstatisticas = (exibidos = eventoList.length) => {
    const estatisticas = document.querySelector('#estatisticas')
    const totalEventos = eventoList.length
    const totalVagas = eventoList.reduce((sum, evento) => sum + evento.vagas, 0)
    const totalAtivos = eventoList.filter(evento => evento.ativo).length
    const valorTotalPossivel = eventoList.reduce((sum, evento) => sum + evento.vagas * evento.preco, 0)

    estatisticas.innerHTML = `
        <p>Total de eventos cadastrados: <strong>${totalEventos}</strong></p>
        <p>Exibindo: <strong>${exibidos}</strong></p>
        <p>Total de vagas: <strong>${totalVagas}</strong></p>
        <p>Eventos ativos: <strong>${totalAtivos}</strong></p>
        <p>Valor total possível arrecadado: <strong>${formatarPreco(valorTotalPossivel)}</strong></p>
    `
}

const botaoAdicionar = document.querySelector('#btnCadastrar')
const filtroStatus = document.querySelector('#filtroStatus')
const canceladoCheckbox = document.querySelector('#cancelado')
const motivoCancelamentoInput = document.querySelector('#motivoCancelamento')

if (filtroStatus) {
    filtroStatus.addEventListener('change', () => carregarLista())
}

if (canceladoCheckbox && motivoCancelamentoInput) {
    canceladoCheckbox.addEventListener('change', () => {
        motivoCancelamentoInput.disabled = !canceladoCheckbox.checked
        if (!canceladoCheckbox.checked) {
            motivoCancelamentoInput.value = ''
        }
    })
}

botaoAdicionar.addEventListener('click', (event) => {
    event.preventDefault()

    const titulo = document.querySelector('#titulo').value.trim()
    const local = document.querySelector('#local').value.trim()
    const vagas = document.querySelector('#vagas').value.trim()
    const preco = parseFloat(document.querySelector('#preco').value)
    const dataInput = document.querySelector('#data').value
    const observacao = document.querySelector('#observacao').value.trim()
    const ativo = document.querySelector('#ativo').checked
    const cancelado = document.querySelector('#cancelado').checked
    const motivoCancelamento = document.querySelector('#motivoCancelamento').value.trim()

    const data = dataInput ? new Date(dataInput) : null
    const dataValida = data instanceof Date && !isNaN(data.getTime())

    if (!titulo || !local) {
        alert('Por favor, informe título e local do evento.')
        return
    }

    if (!vagas || Number(vagas) <= 0) {
        alert('Por favor, informe uma quantidade de vagas válida.')
        return
    }

    if (isNaN(preco) || preco <= 0) {
        alert('Por favor, informe um preço válido maior que zero.')
        return
    }

    if (!dataValida) {
        alert('Por favor, informe uma data válida para o evento.')
        return
    }

    if (cancelado && !motivoCancelamento) {
        alert('Por favor, informe o motivo do cancelamento ao marcar o evento como cancelado.')
        return
    }

    const cancelamento = cancelado ? motivoCancelamento : null
    const eventoAtivo = cancelado ? false : ativo

    criarEvento(titulo, local, vagas, preco, data, eventoAtivo, observacao || undefined, cancelamento)
    carregarLista()

    document.querySelector('#titulo').value = ''
    document.querySelector('#local').value = ''
    document.querySelector('#vagas').value = ''
    document.querySelector('#preco').value = ''
    document.querySelector('#data').value = ''
    document.querySelector('#observacao').value = ''
    document.querySelector('#ativo').checked = false
    document.querySelector('#cancelado').checked = false
    document.querySelector('#motivoCancelamento').value = ''
    document.querySelector('#motivoCancelamento').disabled = true

    if (filtroStatus) {
        filtroStatus.value = 'todos'
    }
})

