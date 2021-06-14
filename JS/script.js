class Produto {
    constructor() {
        this.id = 1;
        this.arrayProdutos = [];
        this.editId = null;

    }

    salvar() {
        let produto = this.lerDados();
        if (this.validaCampos(produto)) {
            if (this.editId == null) {
                this.adicionar(produto);
            } else {
                this.atualizar(this.editId,produto);
            }

        }
        this.listaTabela();
        this.cancelar();
    }

    listaTabela() {
        let tbody = document.getElementById('tbody');
        tbody.innerText = ' ';
        for (let i = 0; i < this.arrayProdutos.length; i++) {
            let tr = tbody.insertRow();

            let td_id = tr.insertCell();
            let td_produto = tr.insertCell();
            let td_valor = tr.insertCell();
            let td_açoes = tr.insertCell();

            td_id.innerText = this.arrayProdutos[i].id;
            td_produto.innerText = this.arrayProdutos[i].nome;
            td_valor.innerText = this.arrayProdutos[i].preco;

            td_id.classList.add('center')

            let imgEdit = document.createElement('img');
            imgEdit.src = 'img/editar-script.svg';
            imgEdit.setAttribute("onclick", "produto.editar(" + JSON.stringify(this.arrayProdutos[i]) + ")")

            let imgDelete = document.createElement('img');
            imgDelete.src = 'img/eletar-conta.svg';
            imgDelete.setAttribute("onclick", "produto.deletar(" + this.arrayProdutos[i].id + ")")

            td_açoes.appendChild(imgEdit);
            td_açoes.appendChild(imgDelete);
            console.log(this.arrayProdutos)
        }
    }

   async adicionar(produto) {
    fetch('http://localhost:3000', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({produto})
            .then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                produto.nome = data.produtoCriado.nome
                produto.Preco = data.produtoCriado.preco
                produto.id = data.produtoCriado.id_produto
            })
    })
    }

    atualizar(id, produto) {
        
        for (let i = 0; i < this.arrayProdutos.length; i++) {
            if (this.arrayProdutos[i].id == id) {
                this.arrayProdutos[i].nome = produto.nome
                this.arrayProdutos[i].preco = produto.preco
            }
        }
    }

    editar(dados) {
        this.editId = dados.id;


        document.getElementById('produto').value = dados.nome;
        document.getElementById('preço').value = dados.preco;

        document.getElementById('btn1').innerText = 'Atualizar'
    }

    validaCampos(produto) {
        let msg = ``
        if (produto.nome == ``) {
            msg += `- Informe o nome do produto \n`
        }
        if (produto.preco == ``) {
            msg += `- Informe o preço do produto \n`
        }
        if (msg != ``) {
            alert(msg);
            return false
        }
        return true
    }

    lerDados() {
        let produto = {}

        produto.id = this.id;
        produto.Produto = document.getElementById('produto').value;
        produto.Preco = document.getElementById('preço').value;

        return produto;
    }

    cancelar() {
        document.getElementById('produto').value = ' ';
        document.getElementById('preço').value = ' ';

    }

    deletar(id) {

        if (confirm('Deseja Relmente Delete Este Produto?' + id)) {
            let tbody = document.getElementById('tbody');

            for (let i = 0; i < this.arrayProdutos.length; i++) {
                if (this.arrayProdutos[i].id == id) {
                    this.arrayProdutos.splice(i, 1)
                    tbody.deleteRow(i);
                }
            }

            console.log(this.arrayProdutos)
        }
    }



}

var produto = new Produto;