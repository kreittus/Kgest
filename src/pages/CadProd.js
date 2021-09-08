import { useEffect, useState } from 'react'
import { TopTitle } from "../components/topTitle";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Checkbox, FormControlLabel, LinearProgress, TextField, Typography, Box, useMediaQuery } from '@material-ui/core';
import { supabase } from '../services/supabase'
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
//import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { MatRemove } from '../components/MatRemove';
import { ButtonPsl } from '../components/ButtonPsl/Index';



import NumberFormat from "react-number-format";

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';




function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'span'} >{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};








export function CadProd() {
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [precoCompra, setPrecoCompra] = useState(0.00);
    const [precoVenda, setPrecoVenda] = useState(0.00);
    const [margemLucro, setMargemLucro] = useState(0.0);
    const [estoqueInicial, setEstoqueInicial] = useState(0);
    const [value, setValue] = useState(0);
    const [refreshListaProducts, setRefreshListaProducts] = useState(false);
    const [checked, setChecked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingRegistros, setLoadingRegistros] = useState(false);
    const [rows, setRows] = useState([
        { id: '', product: '', precoCompra: '', precoVenda: '', margemLucro: '', estoque: '', tipoProd: '' },
    ])
    const inputCelWidth = '80vw';
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(3),
            },

        },

        lblId: {
            width: matches ? inputCelWidth : '10vw',
        },
        lblDesc: {
            width: matches ? inputCelWidth : '65vw',
        },
        topo: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
        },
        meio: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
        },
        containerListagem: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '60vh',
            width: matches ? '100vw' : '76vw',

        },
        containerListagemDataGrid: {
            background: '#FFF',
            height: '60vh',
            width: '76vw',

        },

        formControlLabel: {
            marginLeft: '0vh',
        },
        numberFormat: {
            borderRadius: 3,
            height: 40,
            border: 0,

        }

    }));

    const classes = useStyles();


    const columns = [
        {
            field: 'id',
            headerName: 'Código',
            width: 180,
        },
        {
            field: 'descricao',
            headerName: 'Produto',
            width: 200,
        },
        {
            field: 'precoCompra',
            headerName: 'Preço de compra',
            width: 190,
            align: 'right',
            headerAlign: 'right',
        },
        {
            field: 'precoVenda',
            headerName: 'Preço de venda',
            width: 180,
            align: 'right',
            headerAlign: 'right',
        },
        {
            field: 'estoqueProd',
            headerName: 'Estoque',
            width: 185,
            align: 'right',
            headerAlign: 'right',
        },
        {
            field: 'margemLucro',
            headerName: 'Margem de lucro',
            width: 185,
            align: 'right',
            headerAlign: 'right',
        },
        {
            field: 'tipoProd',
            headerName: 'Tipo',
            width: 185,
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 140,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                    >
                        <MatRemove index={params.row.id} table={'products'} refresh={() => { setRefreshListaProducts(!refreshListaProducts) }} />
                    </div>
                );
            }
        },
    ]

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                    {loadingRegistros ? <LinearProgress /> : <></>}
                </div>
            </GridOverlay>
        );
    }

    useEffect(() => {
        async function buscaProdutos() {
            setLoadingRegistros(true);
            let { data, error } = await supabase.from('products').select().order('id', { ascending: true })

            if (error) {
                setLoadingRegistros(false);
                alert(error.message)
                return;
            };

            let arrayProducts = [];

            data.forEach(product => {
                arrayProducts.push(
                    {
                        id: product.id,
                        descricao: product.descricao,
                        precoCompra: parseFloat(product.precoCompra).toFixed(2).replace('.', ','),
                        precoVenda: parseFloat(product.precoVenda).toFixed(2).replace('.', ','),
                        margemLucro: product.margemLucro,
                        estoqueProd: product.estoqueProd,
                        tipoProd: product.tipoProd === 'S' ? 'Serviço' : 'Produto'
                    }
                );
            });
            setLoadingRegistros(false)
            setRows(arrayProducts);
        }

        if (value === 1) {
            setRows([
                { id: '', product: '', precoCompra: '', precoVenda: '', margemLucro: '', estoque: '', tipoProd: '' },
            ]);
            buscaProdutos()
        }

    }, [value, refreshListaProducts])

    async function handleSalvar(event) {
        event.preventDefault();

        if (descricao.trim() === '') {
            alert("Digite a descrição do produto.")
            return;
        }

        let produto = {};
        if (String(codigo).trim() !== '') {
            produto = ({
                id: codigo,
                descricao: descricao,
                precoCompra: parseFloat(precoCompra),
                precoVenda: parseFloat(precoVenda),
                margemLucro: margemLucro,
                estoqueProd: estoqueInicial,
                tipoProd: checked ? 'S' : 'P'
            });
        } else {
            produto = ({
                descricao: descricao,
                precoCompra: parseFloat(precoCompra),
                precoVenda: parseFloat(precoVenda),
                margemLucro: margemLucro,
                estoqueProd: estoqueInicial,
                tipoProd: checked ? 'S' : 'P'
            });
        }

        setLoading(true);
        let retorno = await supabase.from('products').upsert(produto)

        if (retorno.error) {
            setLoading(false);
            alert(retorno.error.message);
            return;

        } else {
            setLoading(false);
            alert('Salvo!')
            clearInputs();
            document.getElementById("descProduct").focus()
        }

    }

    async function handleEditar(reg, event) {
        setCodigo(reg.row.id)
        setDescricao(reg.row.descricao)
        setPrecoCompra(reg.row.precoCompra)
        setPrecoVenda(reg.row.precoVenda)
        setMargemLucro(reg.row.margemLucro)
        setEstoqueInicial(reg.row.estoqueProd)
        setChecked(reg.row.tipoProd === 'Serviço' ? true : false)
        handleChangeTab('', 0);
    }

    async function clearInputs() {
        setCodigo('');
        setMargemLucro(0);
        setEstoqueInicial(0);
        setPrecoVenda(0);
        setPrecoCompra(0);
        setDescricao('');
        setChecked(true)
    }

    const handleChangeTab = (event, newValue) => {
        if (newValue === 1) {
            clearInputs();
        };
        setValue(newValue);


    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    return (



        <div className="containerCadProdutos" >
            <TopTitle title="Cadastro de Produtos"></TopTitle>

            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChangeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Cadastro" {...a11yProps(0)} />
                    <Tab label="Listagem" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={classes.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={classes.direction}>
                    <form onSubmit={handleSalvar} className={classes.root}>
                        <TextField id="idProduct" disabled className={classes.lblId} onChange={event => setCodigo(event.target.value)} value={codigo} size="small" label="Código" variant="outlined" />
                        <div>
                            <TextField id="descProduct" className={classes.lblDesc} onChange={event => setDescricao(event.target.value)} value={descricao} size="small" label="Descrição" variant="outlined" />

                            <FormControlLabel
                                className={classes.formControlLabel}
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={e => { setChecked(!checked); setEstoqueInicial(0) }}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                }
                                label="Serviço"
                            />
                        </div>

                        <NumberFormat
                            customInput={TextField}
                            size="small"
                            label="Preço da Compra"
                            onValueChange={values => { setPrecoCompra(values.floatValue) }}
                            value={precoCompra}
                            variant="outlined"
                            id="idPrecoCompra"
                            name="numberformat"
                            onClick={() => { document.getElementById("idPrecoCompra").select() }}
                            onBlur={() => { if (String(precoCompra).trim() === '' || typeof precoCompra === 'undefined') { setPrecoCompra(0) } }}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            prefix="R$ "
                            fixedDecimalScale={true}
                            disabled={checked}

                        />

                        <NumberFormat
                            customInput={TextField}
                            id="idPrecoVenda"
                            name="edtPrecoVenda"
                            size="small"
                            label="Preço para venda"
                            value={precoVenda}
                            onValueChange={values => { setPrecoVenda(values.floatValue) }}
                            variant="outlined"
                            onClick={() => { document.getElementById("idPrecoVenda").select() }}
                            onBlur={() => { if (String(precoVenda).trim() === '' || typeof precoVenda === 'undefined') { setPrecoVenda(0) } }}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            prefix="R$ "
                            fixedDecimalScale={true}
                        />

                        <NumberFormat
                            customInput={TextField}
                            id="idMargemLucro"
                            size="small"
                            format="### %"
                            label="Margem/lucro"
                            onValueChange={values => { setMargemLucro(values.floatValue) }}
                            value={margemLucro}
                            variant="outlined"
                            onClick={() => { document.getElementById("idMargemLucro").select() }}
                            onBlur={() => { if (String(margemLucro).trim() === '' || typeof margemLucro === 'undefined') { setMargemLucro(0) } }}
                            suffix=" %"
                        />
                        <TextField
                            id="idEstoqueInicial"
                            type="number"
                            size="small"
                            label="Estoque Inicial"
                            onChange={event => setEstoqueInicial(event.target.value)}
                            value={estoqueInicial}
                            variant="outlined"
                            onClick={() => { document.getElementById("idEstoqueInicial").select() }}
                            onBlur={() => { if (String(estoqueInicial).trim() === '') { setEstoqueInicial(0) } }}
                            disabled={checked}
                        />
                        <div>
                            <ButtonPsl
                                loading={loading}
                            />

                        </div>

                    </form>
                </TabPanel>
                <TabPanel value={value} index={1} dir={classes.direction}>
                    <div className={classes.containerListagem} >
                        <div className={classes.containerListagemDataGrid}>
                            <DataGrid
                                columns={columns}
                                rows={rows}
                                onRowDoubleClick={handleEditar}
                                checkboxSelection
                                disableSelectionOnClick
                                components={{
                                    LoadingOverlay: CustomLoadingOverlay,
                                }}
                                loading
                                {...rows}

                            />

                        </div>

                    </div>
                </TabPanel>
            </SwipeableViews>


        </div>

    );
}