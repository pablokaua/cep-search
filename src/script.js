const form = document.getElementById('form');
const cep = document.getElementById('cep');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    removeOldAddress();
    if(checkInputs()) getAddressByCep(cep.value);
})


function getAddressByCep(cep){
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url).
    then((response) => {
        if(response.ok){
            response.json().then(showAddress);
            return;
        }
        throw new Error("Ocorreu algum erro ao submeter a busca!");
    }).
    catch((message) => {
        setError("Ocorreu algum erro ao submeter a busca!");
    })
}

function showAddress(data){
    const parentElement = document.querySelector('.container');
    const addressCard = createCardAddress(data);
    if(addressCard !== null){
        parentElement.appendChild(addressCard);
    }
}

function createCardAddress(data){
    const cardAddress = document.createElement('div');
    cardAddress.classList.add('container-address');

    for(const property in data) {
        if(property == 'erro'){
            setError('o CEP informado não existe.');
            return null
        }
        if(data[property] != ''){
            const cardElement = document.createElement('p');
            cardElement.innerText = `${property}: ${data[property]}`;
            cardAddress.appendChild(cardElement);
        } 
    }
    return cardAddress;
}

function removeOldAddress(){
    const body = document.querySelector('body');
    const bodyChilds = document.querySelectorAll('div');
    [...bodyChilds].forEach(child => {
        if(child.classList.contains('container-address')){
            child.remove();
        }
    }) 
}


function checkInputs(){
    const cepValue = cep.value;

    if(cepValue === ""){
        setError('Valor inválido. Preencha o campo.');
    } else if (!isValidCep(cepValue)) {
        setError('Valor inválido. Verifique se o cep possui 8 digítos.');
    } else {
        setSucess();
    }
    const formControl = document.querySelector('.form-control');
    return formControl.className === "form-control sucess";
}


function setError(message){
    const formControl = document.querySelector('.form-control');
    const small = document.querySelector('small');
    small.innerText = message;
    formControl.className = "form-control error";
}

function setSucess(){
    const formControl = document.querySelector('.form-control');
    formControl.className = "form-control sucess";
}

function isValidCep(cep) {
    const patternSlash = /^[0-9]{5}-[0-9]{3}$/;
    const patternNumber = /^[0-9]{5}[0-9]{3}$/;
    return (patternNumber.test(cep) || patternSlash.test(cep));
}