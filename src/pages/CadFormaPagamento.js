import React, { useEffect } from 'react'
import { useState } from 'react'
import { TopTitle } from "../components/topTitle";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, LinearProgress, useMediaQuery } from '@material-ui/core';
import { supabase } from '../services/supabase'
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { MatRemove } from '../components/MatRemove';
import { ButtonPsl } from '../components/ButtonPsl/Index';

import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NumberFormat from "react-number-format";


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

export function CadFormaPagamento() {
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [taxa, setTaxa] = useState(0);
    const [value, setValue] = useState(0);
    const [refreshListaFormas, setRefreshListaFormas] = useState(false);
    const [teste, setTeste] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRegistros, setLoadingRegistros] = useState(false);
    const [rows, setRows] = useState([
        { id: '', descricao: '', taxa: '' },
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
            width: matches ? inputCelWidth : '70vw',
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
            headerName: 'Descrição',
            width: 730,
        },
        {
            field: 'taxa',
            headerName: 'Taxa',
            width: 190,
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
                        <MatRemove teste={teste} index={params.row.id} table={'formasPagamento'} refresh={() => { setRefreshListaFormas(!refreshListaFormas) }} />
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
        async function buscaItens() {
            setLoadingRegistros(true);
            let arrayItens = [];


            let { data, error } = await supabase.from('formasPagamento').select().order('id', { ascending: true })

            if (error) {
                setLoadingRegistros(false);
                alert(error.message)
                return;
            };


            data.forEach(product => {
                arrayItens.push(
                    {
                        id: product.id,
                        descricao: product.descricao,
                        taxa: parseFloat(product.taxa).toFixed(2).replace('.', ','),
                    }
                );
            });

            setRows(arrayItens);
            setLoadingRegistros(false);


        }

        if (value === 1) {
            setRows([
                { id: '', descricao: '', taxa: '' },
            ]);
            buscaItens()
        }

    }, [value, refreshListaFormas])

    async function handleSalvar(event) {
        event.preventDefault();

        if (descricao.trim() === '') {
            alert("Digite a descrição.")
            return;
        }

        let registro = {};
        if (String(codigo).trim() !== '') {
            registro = ({
                id: codigo,
                descricao: descricao,
                taxa: parseFloat(String(taxa).replace(',', '.')),
            });
        } else {
            registro = ({
                descricao: descricao,
                taxa: parseFloat(String(taxa).replace(',', '.')),
            });
        }


        let retorno = await supabase.from('formasPagamento').upsert(registro)
        setLoading(true);

        if (retorno.error) {
            setLoading(false);
            alert(retorno.error.message);
            return;

        } else {
            alert('Salvo!')
            setLoading(false);
            setTeste(true)
            clearInputs();
            document.getElementById("descricao").focus()
        }

    }

    async function handleEditar(reg, event) {
        setCodigo(reg.row.id)
        setDescricao(reg.row.descricao)
        setTaxa(reg.row.taxa)

        handleChangeTab('', 0);
    }

    async function clearInputs() {
        setCodigo('');
        setDescricao('');
        setTaxa(0);

    }

    const handleChangeTab = (event, newValue) => {
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
        <div className="containerCadastro" >
            <TopTitle title="Formas de pagamento"></TopTitle>

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
                        <TextField id="id" disabled className={classes.lblId} onChange={event => setCodigo(event.target.value)} value={codigo} size="small" label="Código" variant="outlined" />
                        <TextField id="descricao" className={classes.lblDesc} onChange={event => setDescricao(event.target.value)} value={descricao} size="small" label="Descrição" variant="outlined" />

                        <NumberFormat
                            customInput={TextField}
                            size="small"
                            label="Taxa"
                            onValueChange={values => setTaxa(values.floatValue)}
                            value={taxa}
                            variant="outlined"
                            id="idTaxa"
                            onClick={() => { document.getElementById("idTaxa").select() }}
                            onBlur={() => { if (String(taxa).trim() === '') { setTaxa(0) } }}
                            decimalSeparator=","
                            decimalScale={2}

                        />
                        <div>
                            <ButtonPsl
                                loading={loading}
                            />
                        </div>

                    </form>
                </TabPanel>
                <TabPanel value={value} index={1} dir={classes.direction}>
                    <div className={classes.containerListagem}>
                        <div className={classes.containerListagemDataGrid} >
                            <DataGrid
                                columns={columns}
                                rows={rows}
                                components={{
                                    LoadingOverlay: CustomLoadingOverlay,
                                }}
                                loading
                                {...rows}
                                onRowDoubleClick={handleEditar}
                                checkboxSelection
                                disableSelectionOnClick

                            />
                        </div>
                    </div>
                </TabPanel>
            </SwipeableViews>


        </div>

    );
}