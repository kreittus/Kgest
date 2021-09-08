import { useState, useEffect, useRef } from 'react';

import { supabase } from '../../services/supabase';
import { TopTitle } from "../topTitle";

import { TextField, makeStyles, useTheme, useMediaQuery, Button, CircularProgress } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';


import Autocomplete from '@material-ui/lab/Autocomplete';
import NumberFormat from 'react-number-format';

import './style.scss'


export function Movimento({ tipo, title }) {
    let headerTableCustoPagamento = tipo === 'V' ? 'Forma de pagamento' : 'Centro de custo'
    let fieldTableCustoPagamento = tipo === 'V' ? 'formaPagamento' : 'centroCusto'

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
        },
        {
            field: 'product',
            headerName: 'Produto',
            width: 150,
        },
        {
            field: 'funcionario',
            headerName: 'Funcionario',
            width: 150,
        },
        {
            field: 'qtde',
            headerName: 'QTDE',
            width: 140,
        },
        {
            field: 'vlrUnitario',
            headerName: 'Valor Unitário',
            width: 150,
        },
        {
            field: 'vlrTotal',
            headerName: 'Valor Total',
            width: 150,
        },
        {
            field: fieldTableCustoPagamento,
            headerName: headerTableCustoPagamento,
            width: 213,
        },
    ]

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const lgPersonalizada = useMediaQuery('(max-width:1400px)');
    const useStyles = makeStyles((theme) => ({
        form: {
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            width: matches ? '80vw' : '25vw',
            margin: theme.spacing(3),
            '& > *': {
                margin: '5px',
            },
        },
        inputCodigo: {
            width: matches ? "80vw" : "30vw",
            marginBottom: "5vh",
            zIndex: "3",
        },
        inputFuncionario: {
            width: matches ? "80vw" : "30vw",
            marginBottom: "5vh",
            zIndex: "2",
        },
        inputFormapagamento: {
            width: matches ? "80vw" : "30vw",
            marginBottom: "5vh",
            zIndex: "1",
        },
        inputQtde: {
            width: matches ? "80vw" : "7vw",
            zIndex: "0",
        },
        inputValorUnitario: {
            width: matches ? "80vw" : "8vw",
            zIndex: "0",
        },
        inputValorTotal: {
            width: matches ? "80vw" : lgPersonalizada ? '7vw' : "8vw",
            zIndex: "0",
        },
        containerLista: {
            margin: theme.spacing(3),
        },

        containerVenda: {
            background: '#FFF',
            height: '60vh',
            width: matches ? '83vw' : '48vw',

        },
        containerMovVenda: {
            display: matches ? 'grid' : 'flex',
        },
        button: {
            width: matches ? "80vw" : "24.4vw",
        },
        valorTotal: {
            display: 'flex',
            justifyContent: matches ? 'flex-start' : 'space-between',
            marginTop: theme.spacing(2),
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: theme.spacing(1),
            '& > *': {
                margin: '5px',
            },
            height: '9vh'
        },
        search: {
            styling: {
                background: '#000',
            },
        },
        inputs: {
            '&>*': {
                margin: '3px',
            },
            width: matches ? '80vw' : '',
        },

    }));



    const [data, setData] = useState([]);
    const [dataFuncionarios, setDataFuncionarios] = useState([]);
    const [dataFormasPagamento, setDataFormasPagamento] = useState([]);
    const [dataCentroCusto, setDataCentroCusto] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [codigoFuncionario, setCodigoFuncionario] = useState('');
    const [descricao, setDescricao] = useState('');
    const [estoque, setEstoque] = useState('');
    const [descricaoFuncionario, setDescricaoFuncionario] = useState('');
    const [qtde, setQtde] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [valorVenda, setValorVenda] = useState('');
    const [cadastrarProduto, setCadastrarProduto] = useState(false)
    const [produtosCadastrar, setProdutosCadastrar] = useState([])
    const [totalItens, setTotalItens] = useState('0');
    const [refreshProducts, setRefreshProducts] = useState(true);
    const [tipoProd, setTipoProd] = useState('');
    const [idFormaPagamento, setIdFormaPagamento] = useState('');
    const [formaPagamento, setFormaPagamento] = useState([]);
    const [loading, setLoading] = useState(false);
    const [centro, setCentro] = useState([]);

    const [zerarAutoComplete, setZerarAutoComplete] = useState(false);

    const [rows, setRows] = useState([
        { id: '', product: '', funcionario: '', qtde: '', vlrUnitario: '', vlrTotal: '', formaPagamento: '' },
    ])


    const classes = useStyles();

    let count = [];

    let formaPagamento2 = {};
    //let centro = {}

    let inputRef = useRef();

    useEffect(() => {

        async function loadingProducts() {
            let arrayItens = [];
            let tipoProd = tipo === 'C' ? 'P' : ''
            let campoTipoProd = tipo === 'C' ? 'tipoProd' : ''


            let retornoListaProduto = await supabase.from('products').select().eq(campoTipoProd, tipoProd).order('id', { ascending: true });

            let products = retornoListaProduto.data

            products.forEach(product => {
                arrayItens.push(
                    {
                        id: product.id,
                        title: product.id + " - " + product.descricao,
                        valorUnitario: product.precoVenda,
                        valorUnitarioCompra: product.precoCompra,
                        estoque: product.estoqueProd,
                        tipoProd: product.tipoProd,
                    }
                )

            })
            setData(arrayItens)

        }

        loadingProducts();


    }, [tipo, refreshProducts])

    useEffect(() => {

        async function loadingFuncionarios() {
            let arrayFuncionarios = [];
            let retornoListaFuncionarios = await supabase.from('funcionarios').select();

            let funcionarios = retornoListaFuncionarios.data

            funcionarios.forEach(funcionarios => {
                arrayFuncionarios.push(
                    {
                        id: funcionarios.id,
                        title: funcionarios.id + " - " + funcionarios.nome,
                    }
                )

            })
            setDataFuncionarios(arrayFuncionarios)

        }

        async function loadingFormasPagamento() {
            let arrayFormasPagamento = [];

            let retornoListaFormaPagamento = await supabase.from('formasPagamento').select();

            let formasPagamento = retornoListaFormaPagamento.data

            formasPagamento.forEach(formaPagamento => {
                arrayFormasPagamento.push(
                    {
                        id: formaPagamento.id,
                        title: formaPagamento.descricao,
                        taxa: formaPagamento.taxa,
                    }
                )

            })
            setDataFormasPagamento(arrayFormasPagamento)


        }
        async function loadingCentroCusto() {
            let arrayCentroCusto = [];

            let retornoListaCentoCusto = await supabase.from('centroCusto').select();

            let centroCusto = retornoListaCentoCusto.data

            centroCusto.forEach(centro => {
                arrayCentroCusto.push(
                    {
                        id: centro.id,
                        title: centro.descricao,
                    }
                )

            })
            setDataCentroCusto(arrayCentroCusto)


        }

        inputRef.focus();
        handleCancelarVenda();
        loadingFuncionarios();
        switch (tipo) {
            case 'V':
                loadingFormasPagamento();
                break;

            case 'C':
                loadingCentroCusto();
                break;

            default:
                loadingFormasPagamento();
                loadingCentroCusto();
                break;
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipo]);

    async function handleOnChangeProcuct(item, reason) {
        if (reason === 'clear') {
            setCodigo('');
            setDescricao('')
            setEstoque('')
            setValorUnitario('');
            setValorTotal('');
            setQtde('');
            setFormaPagamento([]);
            formaPagamento2 = [];
        }
        if (reason === 'select-option') {
            setCodigo(item.id);
            setDescricao(item.title);
            setEstoque(item.estoque);
            setTipoProd(item.tipoProd);
            setValorUnitario(tipo === 'V' ? item.valorUnitario : item.valorUnitarioCompra);
            setValorTotal(tipo === 'V' ? item.valorUnitario : item.valorUnitarioCompra);
            setQtde('1');
            setCadastrarProduto(false);
            handleTotalCalculator();

        }

    }

    async function handleOnChangeFuncionario(item, reason) {
        if (reason === 'clear') {
            setCodigoFuncionario('');
            setDescricaoFuncionario('')
        }
        if (reason === 'select-option') {
            setCodigoFuncionario(item.id);
            setDescricaoFuncionario(item.title)
        }

    }
    async function handleOnChangeFormaPagamento(item, reason) {
        if (reason === 'clear') {
            setIdFormaPagamento('');
            setFormaPagamento([]);
        }
        if (reason === 'select-option') {
            setIdFormaPagamento(item.id);
            setFormaPagamento(item);
            formaPagamento2 = item;
            setFormaPagamento(item);
            handleTotalCalculator();
        }

    }

    async function handleTotalCalculator(qtdeChange = 0, vlrUnitarioChange = 0) {
        let qtdeCalculator = qtdeChange > 0 ? parseInt(qtdeChange) : qtde.trim() !== '' ? parseInt(qtde) : 0;
        let vlrUnitarioCalculator = vlrUnitarioChange > 0 ? parseFloat(vlrUnitarioChange) : valorUnitario !== '' ? parseFloat(valorUnitario) : 0

        let valorTotal = 0;
        let taxa = formaPagamento2 === null ? 0 : formaPagamento2.taxa;

        if (qtdeCalculator > 0 && vlrUnitarioCalculator > 0) {
            valorTotal = qtdeCalculator * vlrUnitarioCalculator;
            if (taxa > 0) {
                valorTotal = valorTotal - (valorTotal * (formaPagamento2.taxa / 100))
            }

            setValorTotal(
                (
                    valorTotal.toFixed(2).replace('.', ',')
                )
            )
        }
    }


    async function handleInsertTableItem(e) {
        e.preventDefault();

        if (codigo === '' && !cadastrarProduto) {
            alert('Insira um produto.');
            return;
        }
        if (codigoFuncionario === '') {
            alert('Insira o funcionário responsável.');
            return;
        }
        if (qtde === '') {
            alert('Insira a quantidade do produto.');
            return;
        }

        if (typeof valorUnitario === 'undefined') {
            alert('Insira o valor unitário do produto.');
            return;
        }
        if (typeof valorTotal === 'undefined' || valorTotal === '') {
            alert('Insira o valor total do produto.');
            return;
        }

        if (String(idFormaPagamento).trim() === '' && tipo === 'V') {
            alert('Insira a forma de pagamento');
            return;
        } else if (centro.length === 0 && tipo === 'C') {
            alert('Insira o Centro de custo');
            return;
        }


        if (cadastrarProduto) {
            if (produtosCadastrar.length === 0) {
                setProdutosCadastrar(
                    [
                        {
                            descricao: descricao,
                            precoCompra: valorUnitario,
                            precoVenda: valorVenda,
                            estoqueProd: qtde,
                            tipoProd: 'P',
                        }
                    ]
                )

            } else {
                let lisProducts = []
                let array = []
                lisProducts = produtosCadastrar
                lisProducts.forEach((item) => {
                    array.push(item)
                });
                array.push(
                    {
                        descricao: descricao,
                        precoCompra: valorUnitario,
                        precoVenda: valorVenda,
                        estoqueProd: qtde,
                        tipoProd: 'P',
                    }
                )
                setProdutosCadastrar(array)

            }

        }




        count = rows.length;
        let valorTotalFormatado = '' + valorTotal;
        valorTotalFormatado = valorTotalFormatado.replace(',', '.');
        valorTotalFormatado = parseFloat(valorTotalFormatado).toFixed(2)
        if (rows.length === 1 && rows[0].id === '') {
            if (tipo === 'V') {
                setRows(
                    [
                        {
                            id: count,
                            product: descricao,
                            funcionario: descricaoFuncionario,
                            qtde: qtde,
                            vlrUnitario: valorUnitario.toFixed(2).replace('.', ','),
                            vlrTotal: valorTotalFormatado.replace('.', ','),
                            formaPagamento: formaPagamento.title,
                            idProd: codigo,
                            estoqueProd: estoque,
                            tipoProd: tipoProd,
                            idFuncionario: codigoFuncionario,
                            idFormaPagamento: formaPagamento.id,
                            descricaoFormaPagamento: formaPagamento.title,
                            taxaFormaPagamento: formaPagamento.taxa,
                        }
                    ]
                )
            } else {
                setRows(
                    [
                        {
                            id: count,
                            product: descricao,
                            funcionario: descricaoFuncionario,
                            qtde: qtde,
                            vlrUnitario: valorUnitario.toFixed(2).replace('.', ','),
                            vlrTotal: valorTotalFormatado.replace('.', ','),
                            formaPagamento: formaPagamento.title,
                            idProd: codigo,
                            estoqueProd: estoque,
                            idFuncionario: codigoFuncionario,
                            idCentroCusto: centro.id,
                            centroCusto: centro.title,
                        }
                    ]
                )
            }

        } else {
            count = rows.length + 1;
            let listItens = [];
            let rowsItens = [];
            listItens = rows
            listItens.forEach((item) => {
                rowsItens.push(item)
            });
            if (tipo === 'V') {
                rowsItens.push(
                    {
                        id: count,
                        product: descricao,
                        funcionario: descricaoFuncionario,
                        qtde: qtde,
                        vlrUnitario: valorUnitario.toFixed(2).replace('.', ','),
                        vlrTotal: valorTotalFormatado.replace('.', ','),
                        formaPagamento: formaPagamento.title,
                        idProd: codigo,
                        estoqueProd: estoque,
                        tipoProd: tipoProd,
                        idFuncionario: codigoFuncionario,
                        idFormaPagamento: formaPagamento.id,
                        descricaoFormaPagamento: formaPagamento.title,
                        taxaFormaPagamento: formaPagamento.taxa,
                    }
                )
            } else {
                rowsItens.push(
                    {
                        id: count,
                        product: descricao,
                        funcionario: descricaoFuncionario,
                        qtde: qtde,
                        vlrUnitario: valorUnitario.toFixed(2).replace('.', ','),
                        vlrTotal: valorTotalFormatado.replace('.', ','),
                        formaPagamento: formaPagamento.title,
                        idProd: codigo,
                        estoqueProd: estoque,
                        idFuncionario: codigoFuncionario,
                        idCentroCusto: centro.id,
                        centroCusto: centro.title,
                    }
                )
            }


            setRows(rowsItens)
        }
        let total = parseFloat(totalItens.replace(',', '.')) + parseFloat(valorTotalFormatado)
        total = total.toFixed(2);
        total = total.replace('.', ',');

        setTotalItens(total);
        clearFields();

    }

    async function clearFields() {
        setCodigo('');
        setCodigoFuncionario('');
        setDescricaoFuncionario('');
        setDescricao('');
        setEstoque('');
        setQtde('');
        setValorUnitario('');
        setValorTotal('');
        setValorVenda('');
        setIdFormaPagamento('');
        setZerarAutoComplete(!zerarAutoComplete)
    }

    async function handleCancelarVenda() {
        clearFields();
        setTotalItens('0');
        setCadastrarProduto(false);
        setRows([
            { id: '', product: '', qtde: '', vlrUnitario: '', vlrTotal: '' },
        ]);
        setProdutosCadastrar([]);

    }

    async function handleFinishSell(e) {
        e.preventDefault();
        setLoading(true);

        if (rows[0].id !== '') {
            const { data, status } = await supabase
                .from('movimento')
                .select('idMovi')
                .order('idMovi', { ascending: false })
                .limit(1)
                .single()

            let idMovimento = 0;

            if (status === 406) {
                idMovimento = 1
            } else {
                idMovimento = data.idMovi + 1;
            }



            let arrayMovimento = [];
            let arrayProdsEstoque = [];


            var dataAtual = new Date();
            var dia = String(dataAtual.getDate()).padStart(2, '0');
            var mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            var ano = dataAtual.getFullYear();
            var date = ano + '-' + mes + '-' + dia;
            let time = String(dataAtual).substr(16, 8)

            let produtosCadastrados = [];
            let countProd = 0;

            if (tipo === 'C' && produtosCadastrar.length > 0) {
                let retornoCadastraProduto = await supabase.from('products').insert(produtosCadastrar)
                if (retornoCadastraProduto.error) {
                    alert(retornoCadastraProduto.error.message);
                    return;
                } else {
                    alert('Produtos cadastrados!')
                    produtosCadastrados = retornoCadastraProduto.data;
                }
            }

            if (tipo === 'V') {
                rows.forEach((row) => {
                    arrayMovimento.push(
                        {
                            idMovi: idMovimento,
                            produto: row.product,
                            tipoMov: 'V',
                            dataMovi: date,
                            hourMovi: time,
                            qtde: row.qtde,
                            funcionario: row.funcionario,
                            valorMovi: parseFloat(totalItens.replace(',', '.')),
                            valorTotalItem: parseFloat(row.vlrTotal.replace(',', '.')),
                            idProd: parseInt(row.idProd),
                            idFuncionario: parseInt(row.idFuncionario),
                            idFormaPagamento: row.idFormaPagamento,
                            descFormaPagamento: row.descricaoFormaPagamento,
                            taxaFormaPagamento: row.taxaFormaPagamento,
                        }
                    );

                    if (row.tipoProd === 'P') {
                        arrayProdsEstoque.push(
                            {
                                id: parseInt(row.idProd),
                                estoqueProd: parseInt((row.estoqueProd)),
                                qtde: parseInt(row.qtde)
                            }
                        );
                    }
                });
            } else {
                rows.forEach((row) => {
                    arrayMovimento.push(
                        {
                            idMovi: idMovimento,
                            produto: row.idProd !== '' ? row.product : produtosCadastrados[countProd].id + ' - ' + produtosCadastrados[countProd].descricao,
                            tipoMov: 'C',
                            dataMovi: date,
                            hourMovi: time,
                            qtde: row.qtde,
                            funcionario: row.funcionario,
                            valorMovi: parseFloat(totalItens.replace(',', '.')),
                            valorTotalItem: parseFloat(row.vlrTotal.replace(',', '.')),
                            idProd: row.idProd !== '' ? parseInt(row.idProd) : produtosCadastrados[countProd].id,
                            idFuncionario: parseInt(row.idFuncionario),
                            idCentroCusto: row.idCentroCusto,
                            centroCusto: row.centroCusto,
                        }
                    );
                    if (row.idProd !== '') {
                        arrayProdsEstoque.push(
                            {
                                id: parseInt(row.idProd),
                                estoqueProd: (parseInt(row.estoqueProd)),
                                precoCompra: parseFloat(row.vlrUnitario.replace(',', '.')),
                                qtde: parseInt(row.qtde)
                            }
                        );
                    } else {
                        countProd += 1;
                    }
                });
            }

            let arrayProdsEstoqueAgrupados = [];
            let prodsAgrupados = [];
            let estoqueFinal = 0;
            let precoCompra = 0.00;
            if (arrayProdsEstoque.length > 0) {
                for (let i = 0; i <= (arrayProdsEstoque.length - 1); i++) {
                    estoqueFinal = arrayProdsEstoque[i].estoqueProd;
                    for (let c = 0; c <= (arrayProdsEstoque.length - 1); c++) {
                        if (tipo === 'V' && !prodsAgrupados.includes(arrayProdsEstoque[i].id) && (arrayProdsEstoque[i].id === arrayProdsEstoque[c].id)) {
                            estoqueFinal -= parseInt(arrayProdsEstoque[c].qtde)
                        }
                        if (tipo === 'C' && !prodsAgrupados.includes(arrayProdsEstoque[i].id) && (arrayProdsEstoque[i].id === arrayProdsEstoque[c].id)) {
                            estoqueFinal += parseInt(arrayProdsEstoque[c].qtde)
                            precoCompra = arrayProdsEstoque[c].precoCompra
                        }

                    }
                    if (!prodsAgrupados.includes(arrayProdsEstoque[i].id)) {
                        if (tipo === 'V') {
                            arrayProdsEstoqueAgrupados.push(
                                {
                                    id: arrayProdsEstoque[i].id,
                                    estoqueProd: estoqueFinal,
                                }
                            );
                        }

                        if (tipo === 'C') {
                            arrayProdsEstoqueAgrupados.push(
                                {
                                    id: arrayProdsEstoque[i].id,
                                    estoqueProd: estoqueFinal,
                                    precoCompra: precoCompra
                                }
                            );
                        }
                        precoCompra = 0;
                        estoqueFinal = 0;
                        prodsAgrupados.push(arrayProdsEstoque[i].id)
                    }

                }

                let retornoEstoque = await supabase.from('products').upsert(arrayProdsEstoqueAgrupados)

                if (retornoEstoque.error) {
                    alert(retornoEstoque.error.message);
                    return;
                }
            }

            let retorno = await supabase.from('movimento').upsert(arrayMovimento)
            if (retorno.error) {
                setLoading(false);
                alert(retorno.error.message);
            } else {
                setLoading(false);
                alert('Movimentação Salva!')
                setRefreshProducts(!refreshProducts)
                handleCancelarVenda();
            }

        }

    }

    async function handleBlurProduct(event) {
        if (tipo === 'C') {
            let idProd = event.target.value.substr(0, 2)
            if (codigo === '' && !Number.isInteger(parseInt(idProd)) && event.target.value.trim() !== '') {
                if (window.confirm('Este Produto parece não existir. Deseja cadastar ele ao finalizar a venda?')) {
                    setCadastrarProduto(true);
                    setDescricao(event.target.value);
                } else {
                    setCadastrarProduto(false);
                    setDescricao('');
                    clearFields();
                }

            }
        }

    }



    return (
        <div>
            <TopTitle title={title}></TopTitle>
            <div className={classes.containerMovVenda}>
                <form className={classes.form}>
                    <div className={classes.inputCodigo}>
                        <Autocomplete
                            key={zerarAutoComplete}
                            id="inpCodigo"
                            options={data}
                            onChange={(event, value, reason) => { handleOnChangeProcuct(value, reason) }}
                            getOptionLabel={(option) => option.title}
                            clearOnBlur={tipo === 'C' ? false : true}
                            onBlur={handleBlurProduct}
                            //style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Código" variant="outlined" inputRef={input => { inputRef = input; }} />}
                        />
                    </div>
                    <div className={classes.inputFuncionario}>
                        <Autocomplete
                            key={zerarAutoComplete}
                            id="inpfuncionarios"
                            options={dataFuncionarios}
                            onChange={(event, value, reason) => { handleOnChangeFuncionario(value, reason) }}
                            getOptionLabel={(option) => option.title}
                            classes={{
                                focused: classes.focused,
                            }}

                            //style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Funcionário" variant="outlined" />}
                        />
                    </div>
                    {tipo === 'V' ?
                        <div className={classes.inputFormapagamento} >
                            <Autocomplete
                                key={zerarAutoComplete}
                                id="cmbFormaPagamento"
                                options={dataFormasPagamento}
                                onChange={(event, value, reason) => { handleOnChangeFormaPagamento(value, reason) }}
                                getOptionSelected={(option, value) => { formaPagamento2 = value; }}
                                getOptionLabel={(option) => option.title}

                                //style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Forma de pagamento" variant="outlined" />}
                            />
                        </div>
                        :
                        <div className={classes.inputFormapagamento} >
                            <Autocomplete
                                key={zerarAutoComplete}
                                id="cmbCentroCusto"
                                options={dataCentroCusto}
                                onChange={(event, value, reason) => { setCentro(value); }}
                                //getOptionSelected={(option, value) => { centro = value }}
                                getOptionLabel={(option) => option.title}
                                //onBlur={() => { }}

                                //style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Centro de custo" variant="outlined" />}
                            />
                        </div>
                    }
                    <div className={classes.inputs}>
                        <NumberFormat
                            customInput={TextField}
                            format="###"
                            id="inpQtde"
                            size="small"
                            value={qtde}
                            onBlur={handleTotalCalculator}
                            onValueChange={values => { setQtde(values.value); handleTotalCalculator(values.value, 0); }}
                            className={classes.inputQtde}
                            label="Quantidade"
                            variant="outlined"
                        />
                        <NumberFormat
                            customInput={TextField}
                            size="small"
                            value={valorUnitario}
                            onBlur={handleTotalCalculator}
                            onValueChange={values => { setValorUnitario(values.floatValue); handleTotalCalculator(0, values.floatValue); }}
                            className={classes.inputValorUnitario}
                            label="valor unitário"
                            variant="outlined"
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            prefix="R$ "
                        />
                        {cadastrarProduto ?
                            <NumberFormat
                                customInput={TextField}
                                size="small"
                                value={valorVenda}
                                onValueChange={values => { setValorVenda(values.floatValue) }}
                                className={classes.inputValorUnitario}
                                label="valor Venda"
                                variant="outlined"
                                thousandSeparator="."
                                decimalSeparator=","
                                decimalScale={2}
                                prefix="R$ "
                            />
                            :
                            ''
                        }
                        <NumberFormat
                            customInput={TextField}
                            size="small"
                            value={valorTotal}
                            onValueChange={values => { setValorTotal(values.floatValue) }}
                            className={classes.inputValorTotal}
                            label="valor total"
                            variant="outlined"
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            prefix="R$ "
                        />
                    </div>



                    <div>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={handleInsertTableItem}
                        >
                            Incluir
                        </Button>
                    </div>
                </form>

                <div className={classes.containerLista}>
                    <div className={classes.containerVenda}>
                        <DataGrid
                            columns={columns}
                            rows={rows}
                            checkboxSelection
                            disableSelectionOnClick

                        />
                    </div>
                    <div className={classes.valorTotal}>
                        {matches ? <h1>V.Total:&nbsp;</h1> : <h1>Valor Total:</h1>}<h1>{totalItens.trim() !== '0' ? totalItens : ''}</h1>
                    </div>
                    <div className={classes.buttons}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCancelarVenda}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFinishSell}
                            disabled={rows[0].id === '' ? true : loading}
                        >
                            {loading && <CircularProgress size={24} />}
                            {loading ? <> &nbsp; &nbsp;</> : <></>}
                            Finalizar
                        </Button>
                    </div>
                </div>


            </div>



        </div >
    );
}
