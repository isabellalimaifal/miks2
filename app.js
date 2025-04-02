//npm init -y
//npm install express ejs
const express = require('express');
const app = express();
const port = 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware para servir arquivos estáticos (CSS, JS)
app.use(express.static('public'));

// Middleware para lidar com dados do formulário
app.use(express.urlencoded({ extended: true }));

// Dados em memória (sem banco de dados)
let items = [];

// Rota para a página principal (mostrar itens)
app.get('/', (req, res) => {
    res.render('index', { items });
});

// Rota para adicionar um novo item
app.post('/add', (req, res) => {
    const newItem = req.body.item.trim();
    if (newItem) {
        items.push(newItem);
    }
    res.redirect('/');
});

// Rota para editar um item
app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    res.render('edit', { item: items[index], index });
});

// Rota para atualizar o item
app.post('/update/:index', (req, res) => {
    const index = req.params.index;
    const updatedItem = req.body.item.trim();
    if (updatedItem) {
        items[index] = updatedItem;
    }
    res.redirect('/');
});

// Rota para excluir um item
app.get('/delete/:index', (req, res) => {
    const index = req.params.index;
    items.splice(index, 1);
    res.redirect('/');
});

// 🔍 Rota para pesquisar itens
app.get('/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : "";

    if (!query) {
        return res.json({ resultados: items.map((item, index) => ({ nome: item, index })), mensagem: "" });
    }

    const resultados = items
        .map((item, index) => ({ nome: item, index })) // Adiciona índice aos itens
        .filter(obj => obj.nome.toLowerCase().includes(query));

    if (resultados.length === 0) {
        return res.json({ resultados: [], mensagem: "Produto não encontrado na lista." });
    }

    res.json({ resultados, mensagem: "" });
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
