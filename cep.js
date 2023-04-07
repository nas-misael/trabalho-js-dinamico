const inputCep = document.querySelector('#cep')
const buttonSearch = document.querySelector('#consultar')
const URL = 'https://viacep.com.br/ws/'
const data = JSON.parse(localStorage.getItem('cepsCadastrados')) || []
const cards = document.querySelector('div.cards')
const divCepInvalidAlert = document.querySelector('div#cepInvalido')


const onlyNumbers = (e) => {
    // console.log(this.value, this.value.match(/\d+/))
    // console.log(this.value, /\d+/.test(this.value))
    e.target.value = e.target.value.replace(/\D+/g, '')
}

const validateEntry = (e) => {
    console.log(e.target.value.length)
    if(e.target.value.length === 8){
        e.target.classList.remove('error')
        buttonSearch.removeAttribute('disabled')
    } else {
        e.target.classList.add('error')
        buttonSearch.setAttribute('disabled', true)
        // this.focus()
    }
}



const getAddress = async (e) => {
    e.preventDefault()
    console.log(inputCep.value)

    const responseCep = await fetch(`${URL}${inputCep.value}/json/`, {
        method: 'GET'
    })
    const cep = await responseCep.json()

    console.log(cep)

    if(cep.erro) {
        console.log('CEP inválido')
        divCepInvalidAlert.classList.remove('hidden')
    } else {
        console.log(cep)
        divCepInvalidAlert.classList.add('hidden')
        data.push(cep)
        console.log(data)
        localStorage.setItem('cepsCadastrados', JSON.stringify(data))
    
        const lines = returnHTMLOfCeps(JSON.parse(localStorage.getItem('cepsCadastrados')))
        
        cards.innerHTML = lines
        inputCep.value = ''
        inputCep.focus()
    }

    fetch(`${URL}${inputCep.value}/json/`, {
        method: 'GET'
    })
    
}

window.addEventListener('load', () => {
    const lines = returnHTMLOfCeps(data)
    cards.innerHTML = lines

})


const returnHTMLOfCeps = (array) => {
    const lines = array.map((item) => {
        return `<div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.logradouro || 'Sem dados'}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${item.bairro || 'Sem dados'} - ${item.localidade || 'Sem dados'} - ${item.uf || 'Sem dados'}</h6>
                        <p class="card-text">${item.cep}</p>
                    </div>
                </div>
        `
    }).join('')

    return lines
}


// viacep.com.br/ws/01001000/json/
inputCep.addEventListener('input', onlyNumbers)
inputCep.addEventListener('focusout', validateEntry)
document.querySelector('#form').addEventListener('submit', getAddress)