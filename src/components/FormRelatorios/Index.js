import { useEffect, useState } from 'react';
import { TextField, Radio, useTheme, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { supabase } from '../../services/supabase';
import { getDataAtualEUA } from '../../services/functions';
import { ButtonPsl } from '../ButtonPsl/Index';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Autocomplete from '@material-ui/lab/Autocomplete';



import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';




import { TopTitle } from '../topTitle/index'
import { Impressao } from '../Impressao/index'


export function FormRelatorios({ tipo, title }) {
    const [valuesDate, setValuesDate] = useState({
        dataInicial: '',
        dataFinal: ''
    });
    const [dataProdutos, setDataProdutos] = useState([]);
    const [dataFuncionarios, setDataFuncionarios] = useState([]);
    const [dataCentroCusto, setDataCentroCusto] = useState([]);
    const [dataFormaPagamento, setDataFormaPagamento] = useState([]);
    const [produtosFilter, setProdutosFilter] = useState('');
    const [funcionariosFilter, setFuncionariosFilter] = useState('');
    const [centroCustoFilter, setCentroCustoFilter] = useState({ id: '' });
    const [formaPagamentoFilter, setFormaPagamentoFilter] = useState({ id: '' });
    const [zerarAutoComplete, setZerarAutoComplete] = useState(false);
    const [selectedValue, setSelectedValue] = useState('M')
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));


    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'grid',
            '& > *': {
                margin: theme.spacing(3),
            },

        },
        inputProducts: {
            zIndex: '2',
        },
        inputFuncionarios: {
            zIndex: '1',
        },

        group: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '0px',

        },
    }))


    const classes = useStyles();


    useEffect(() => {

        setValuesDate({ ...valuesDate, dataInicial: getDataAtualEUA(), dataFinal: getDataAtualEUA() })
        setSelectedValue('M');

        async function loadingProducts() {
            let arrayItens = [];
            let tipoProd = tipo === 'C' ? 'P' : ''
            let campoTipoProd = tipo === 'C' ? 'tipoProd' : ''

            let retorno = await supabase.from('products').select().eq(campoTipoProd, tipoProd).order('id', { ascending: true });

            let products = retorno.data

            products.forEach(product => {
                arrayItens.push(
                    {
                        id: product.id,
                        title: product.id + " - " + product.descricao,
                        valorUnitario: product.precoVenda,
                    }
                )

            })
            setDataProdutos(arrayItens)

        }
        async function loadingFuncionarios() {
            let retorno = await supabase.from('funcionarios').select();

            let funcionarios = retorno.data
            let arrayFuncionarios = [];

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
        async function loadingCentroCusto() {
            let retorno = await supabase.from('centroCusto').select()

            let centrosCusto = retorno.data
            let arrayCentroCusto = [];

            centrosCusto.forEach(centroCusto => {
                arrayCentroCusto.push(
                    {
                        id: centroCusto.id,
                        title: centroCusto.id + " - " + centroCusto.descricao,
                    }
                )

            })
            setDataCentroCusto(arrayCentroCusto)

        }

        async function loadingFormasPagamento() {
            let retorno = await supabase.from('formasPagamento').select()

            let formasPagamento = retorno.data
            let array = [];

            formasPagamento.forEach(formaPagamento => {
                array.push(
                    {
                        id: formaPagamento.id,
                        title: formaPagamento.id + " - " + formaPagamento.descricao,
                    }
                )

            })
            setDataFormaPagamento(array)

        }
        loadingProducts();
        loadingFuncionarios();

        switch (tipo) {
            case 'C':
                loadingCentroCusto();
                break;
            case 'V':
                loadingFormasPagamento();
                break;

            default:
                loadingCentroCusto();
                loadingFormasPagamento();
                break;
        }
        clearFilters();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipo])


    async function handleGerarRelatorio(e) {
        e.preventDefault();



        var dados = [];
        let campoCentroCusto = '';
        let campoFormapagamento = '';
        let centroCusto = '';
        let formaPagamento = '';
        let campoTipoMovi = '';
        let tipoMovi = '';
        let order = 'idMovi';

        switch (selectedValue) {
            case 'M':
                order = 'idMovi';
                break;
            case 'D':
                order = 'dataMovi';
                break;
            case 'C':
                order = 'centroCusto';
                break;
            case 'F':
                order = 'idFormaPagamento';
                break;
            default:
                order = 'idMovi';
                break;
        }

        if (valuesDate.dataInicial === '') {
            alert('Digite a data Inicial.')
            return;
        }
        if (valuesDate.dataFinal === '') {
            alert('Digite a data Final.')
            return;
        }


        if (centroCustoFilter.id !== '') {
            campoCentroCusto = 'idCentroCusto'
            centroCusto = centroCustoFilter.id;
        }

        if (formaPagamentoFilter.id !== '') {
            campoFormapagamento = 'idFormaPagamento'
            formaPagamento = formaPagamentoFilter.id;
        }

        if (tipo !== 'CX') {
            tipoMovi = tipo;
            campoTipoMovi = 'tipoMov'
        }

        setLoading(true);

        if (funcionariosFilter.length > 0 && produtosFilter.length > 0) {
            for (let c = 0; c <= (funcionariosFilter.length - 1); c++) {
                for (let i = 0; i <= (produtosFilter.length - 1); i++) {
                    let { data, error } = await supabase
                        .from('movimento')
                        .select()
                        .gte('dataMovi', valuesDate.dataInicial)
                        .lte('dataMovi', valuesDate.dataFinal)
                        .eq(campoTipoMovi, tipoMovi)
                        .eq('idFuncionario', funcionariosFilter[c].id)
                        .eq('idProd', produtosFilter[i].id)
                        .eq(campoCentroCusto, centroCusto)
                        .eq(campoFormapagamento, formaPagamento)
                        .order(order, { ascending: true });

                    if (error) {
                        alert(error.message);
                        return;
                    }

                    if (data.length > 0) {
                        data.forEach((reg) => {
                            dados.push(reg)
                        })
                    }

                }
            }


        } else if (funcionariosFilter.length > 0) {
            for (let i = 0; i <= (funcionariosFilter.length - 1); i++) {
                let { data, error } = await supabase
                    .from('movimento')
                    .select()
                    .gte('dataMovi', valuesDate.dataInicial)
                    .lte('dataMovi', valuesDate.dataFinal)
                    .eq(campoTipoMovi, tipoMovi)
                    .eq('idFuncionario', funcionariosFilter[i].id)
                    .eq(campoCentroCusto, centroCusto)
                    .eq(campoFormapagamento, formaPagamento)
                    .order(order, { ascending: true });

                if (error) {
                    alert(error.message);
                    return;
                }

                if (data.length > 0) {
                    data.forEach((reg) => {
                        dados.push(reg)
                    })
                }
            }

        } else if (produtosFilter.length > 0) {
            for (let i = 0; i <= (produtosFilter.length - 1); i++) {
                let { data, error } = await supabase
                    .from('movimento')
                    .select()
                    .gte('dataMovi', valuesDate.dataInicial)
                    .lte('dataMovi', valuesDate.dataFinal)
                    .eq(campoTipoMovi, tipoMovi)
                    .eq('idProd', produtosFilter[i].id)
                    .eq(campoCentroCusto, centroCusto)
                    .eq(campoFormapagamento, formaPagamento)
                    .order(order, { ascending: true });

                if (error) {
                    alert(error.message);
                    return;
                }

                if (data.length > 0) {
                    data.forEach((reg) => {
                        dados.push(reg)
                    })
                }
            }


        } else {
            let { data, error } = await supabase
                .from('movimento')
                .select()
                .gte('dataMovi', valuesDate.dataInicial)
                .lte('dataMovi', valuesDate.dataFinal)
                .eq(campoTipoMovi, tipoMovi)
                .eq(campoCentroCusto, centroCusto)
                .eq(campoFormapagamento, formaPagamento)
                .order(order, { ascending: true });

            if (error) {
                alert(error.message);
                return;
            }

            if (data.length > 0) {
                data.forEach((reg) => {
                    dados.push(reg)
                })
            }
        }

        if (dados.length > 0) {


            let registros = await reorganizaRegistros(dados, order);

            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            const classeImpressao = new Impressao(registros, tipo, valuesDate.dataInicial, valuesDate.dataFinal, order);
            const documento = await classeImpressao.PreparaDocumento();
            setProdutosFilter('')
            setFuncionariosFilter('')
            setLoading(false);
            if (matches) {
                pdfMake.createPdf(documento).download();
            } else {
                pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
            }

        } else {
            alert("Registros não encontrados.");
            setLoading(false);
            return;
        }

        clearFilters();

    }

    async function reorganizaRegistros(dados, campoOrder) {
        let registros = [];
        let registrosIncludes = []
        let reg = {};
        let reg2 = {};
        for (let i = 0; i <= (dados.length - 1); i++) {
            reg = dados[i]
            if (!registrosIncludes.includes(reg[campoOrder])) {
                for (let c = 0; c <= (dados.length - 1); c++) {
                    reg2 = dados[c];

                    if (reg[campoOrder] === reg2[campoOrder]) {
                        registros.push(
                            dados[c],
                        );
                    };

                }
                registrosIncludes.push(reg[campoOrder]);
            }

        }
        return registros;
    };

    function clearFilters() {
        setCentroCustoFilter({ id: '' });
        setFormaPagamentoFilter({ id: '' });
        setFuncionariosFilter([]);
        setProdutosFilter([]);
        setZerarAutoComplete(!zerarAutoComplete);
    }

    async function handleOnChangeFormaPagamento(item, reason) {
        if (reason === 'clear') {
            setFormaPagamentoFilter({ id: '' });
        }
        if (reason === 'select-option') {
            setFormaPagamentoFilter({ id: item.id });
        }

    }
    async function handleOnChangeCentroCusto(item, reason) {
        if (reason === 'clear') {
            setCentroCustoFilter({ id: '' });
        }
        if (reason === 'select-option') {
            setCentroCustoFilter({ id: item.id });
        }

    }

    async function handleBlur(e) {
        if (valuesDate[e.target.name] === '') {
            setValuesDate({
                ...valuesDate,
                [e.target.name]: getDataAtualEUA(),
            });
        }

    }

    async function handleChangeDate(e) {
        setValuesDate({
            ...valuesDate,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div>
            <TopTitle title={title} />

            <form onSubmit={handleGerarRelatorio} className={classes.root}>
                <TextField
                    id="lblDataInicial"
                    type="date"
                    name="dataInicial"
                    size="small"
                    label="Data Inicial"
                    variant="outlined"
                    value={valuesDate.dataInicial}
                    onChange={handleChangeDate}
                    onBlur={handleBlur}
                />

                <TextField
                    id="lblDataFinal"
                    name="dataFinal"
                    type="date"
                    size="small"
                    label="Data Final"
                    variant="outlined"
                    value={valuesDate.dataFinal}
                    onChange={handleChangeDate}
                    onBlur={handleBlur}
                />

                <div className={classes.inputProducts}>

                    <Autocomplete
                        multiple
                        key={zerarAutoComplete}
                        id="inpProduto"
                        options={dataProdutos}
                        onChange={(option, value) => { setProdutosFilter(value) }}
                        getOptionLabel={(option) => option.title}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Produtos"
                                size="small"
                            />
                        )}
                    />
                </div>

                <div className={classes.inputFuncionarios}>
                    <Autocomplete
                        multiple
                        key={zerarAutoComplete}
                        id="inpFuncionario"
                        options={dataFuncionarios}
                        onChange={(option, value) => { setFuncionariosFilter(value) }}
                        getOptionLabel={(option) => option.title}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Funcionários"
                                size="small"
                            />
                        )}
                    />
                </div>

                {tipo === 'C' || tipo === 'CX' ?
                    <div className={classes.inputFuncionarios}>
                        <Autocomplete
                            key={zerarAutoComplete}
                            id="inpCentroCusto"
                            options={dataCentroCusto}
                            onChange={(option, value, reason) => { handleOnChangeCentroCusto(value, reason) }}
                            getOptionLabel={(option) => option.title}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Centro de custo"
                                    size="small"
                                />
                            )}
                        />
                    </div>
                    : ''}
                {tipo === 'V' || tipo === 'CX' ?
                    <div className={classes.inputFuncionarios}>
                        <Autocomplete
                            key={zerarAutoComplete}
                            id="inpFormaPagamento"
                            options={dataFormaPagamento}
                            onChange={(option, value, reason) => { handleOnChangeFormaPagamento(value, reason) }}
                            getOptionLabel={(option) => option.title}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Forma de Pagamento"
                                    size="small"
                                />
                            )}
                        />
                    </div>
                    : ''}


                <div className={classes.group}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Agrupar</FormLabel>
                        <RadioGroup row aria-label="gender" name="gender1" value={selectedValue} onChange={e => { setSelectedValue(e.target.value) }}>
                            <FormControlLabel value="M" control={<Radio />} label="Movimento" />
                            <FormControlLabel value="D" control={<Radio />} label="Data" />
                            {tipo !== 'C' ? <FormControlLabel value="F" control={<Radio />} label="Forma Pagamento" /> : ''}
                            {tipo !== 'V' ? <FormControlLabel value="C" control={<Radio />} label="Centro de custo" /> : ''}
                        </RadioGroup>
                    </FormControl>

                    <div>
                        <ButtonPsl
                            loading={loading}
                            title="Gerar"
                        />
                    </div>

                </div>




            </form>
        </div>
    );
}