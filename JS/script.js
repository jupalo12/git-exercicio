class Produto {
    constructor() {
        this.id = 1;
        this.arrayProdutos = [];
        this.editId = null;

    }

    salvar() {
        let produto = this.lerDados(produto);
        if (this.validaCampos(produto)) {
            if (this.editId == null) {
                this.adicionar(produto);
            } else {
                this.atualizar(this.editId, produto);
            }

        }
        this.listaTabela();
        this.cancelar();
    }

    listaTabela() {
        fetch('http://localhost:3000/produtos', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                data.produtos.forEach(prd => {
                    this.arrayProdutos.push(prd);
                });
                // for (let i = 0; i < data.produtos.length; i++) {
                //     console.log(data.produtos[i].id_produto)
                //     for (let j = 0; j < this.arrayProdutos.length; j++) {
                //         console.log(j)
                //         if (i != j) {
                //             // this.arrayProdutos.push(data.produtos[i])

                //         }

                //     }
                //     console.log(this.arrayProdutos)
                // }

                for (let i = 0; i < this.arrayProdutos.length; i++) {
                    let tr = tbody.insertRow();

                    let td_id = tr.insertCell();
                    let td_produto = tr.insertCell();
                    let td_preco = tr.insertCell();
                    let td_acoes = tr.insertCell();

                    td_id.innerText = this.arrayProdutos[i].id; 
                    td_produto.innerText = this.arrayProdutos[i].nome;
                    td_preco.innerText = this.arrayProdutos[i].preco;

                    td_id.classList.add('center');

                    let imgEdit = document.createElement('img');
                    imgEdit.src = './IMG/editar-script.svg';
                    imgEdit.setAttribute("onclick", "produto.editar(" + JSON.stringify(this.arrayProdutos[i]) + ")");

                    let imgDelete = document.createElement('img');
                    imgDelete.src = './IMG/eletar-conta.svg';
                    imgDelete.setAttribute("onclick", "produto.deletar(" + this.arrayProdutos[i].id_produto + ")");

                    td_acoes.appendChild(imgEdit);
                    td_acoes.appendChild(imgDelete);

                }
            })
    }
    

    async adicionar(produto) {
        const formData = new FormData();
        const fileField = document.querySelector('input[type="file"]');

        formData.append('nome', produto.nome);
        //     console.log(produto.nome);
        formData.append('preco', produto.preco);
        //     console.log(produto.preco);
        formData.append('img', fileField.files[0]);
        //   console.log(fileField.files[0]);

        fetch('http://localhost:3000/produtos', {
            method: 'POST',
            body: formData,

        }).then(result => {
            return result.json();
        }).then(data => {
            console.log(data);


            alert(data.mensagem + ' ' + data.produtoCriado.nome);
            produto.preco = parseFloat(data.produtoCriado.preco);
            produto.id = data.produtoCriado.id_produtos;
            produto.nome = data.produtoCriado.nome;
            // console.log("imagem produto " +produto.imagem_produto);
            produto.imagem_produto = data.imagem_produto;
            //  console.log("data imagem "+ data.imagem_produto)

            this.arrayProdutos.push(produto);

        });


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
        produto.nome = document.getElementById('nome').value;
        produto.preco = document.getElementById('preco').value;




        console.log("Produto na Lerdados()" + produto)
        this.validaCampos(produto);
        this.adicionar(produto);
        return produto;

    }

    cancelar() {
        document.getElementById('nome').value = ' ';
        document.getElementById('preco').value = ' ';
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

