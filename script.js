// const init = {} => {
//    const ProdutoNome = document.getElementById('nome');
//    const PreçoNome = document.getElementById('preco');
//    const imgNome = document.getElementById('img');
// }
const Produto = document.getElementById('nome');
const Preco = document.getElementById('preco');
const img = document.getElementById('img');

fetch('http://localhost:3000', {

    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
        email: Produto.value,
        preco: Preco.value,
        img: img.value
    })
        .then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        })
})
