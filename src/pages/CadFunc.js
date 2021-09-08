import { useEffect, useState } from 'react'
import { TopTitle } from "../components/topTitle";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, LinearProgress, useMediaQuery } from '@material-ui/core';
import { supabase } from '../services/supabase'
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { MatRemove } from '../components/MatRemove';
import { formatDate, getDataAtualEUA } from '../services/functions';
import { ButtonPsl } from '../components/ButtonPsl/Index';

import TextField from '@material-ui/core/TextField';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
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


export function CadFunc() {
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [dataAdmissao, setDataAdmissao] = useState('');
    const [dataAniversario, setDataAniversario] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [value, setValue] = useState(0);
    const [refreshListaFuncionarios, setRefreshListaFuncionarios] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRegistros, setLoadingRegistros] = useState(false);
    const [rows, setRows] = useState([
        {
            id: '',
            nome: '',
            endereco: '',
            dataAdmissao: '',
            dataAniversario: '',
            telefone: '',
            dataAdmissaoUnformated: '',
            dataAniversarioUnformated: ''
        },
    ]);

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
        lblNome: {
            width: matches ? inputCelWidth : '57vw',
        },
        lblEndereco: {
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
            width: 122,
        },
        {
            field: 'nome',
            headerName: 'Nome',
            width: 200,
        },
        {
            field: 'endereco',
            headerName: 'Endereço',
            width: 240,
        },
        {
            field: 'dataAdmissao',
            headerName: 'Data de Adimissão',
            width: 180,
        },
        {
            field: 'dataAniversario',
            headerName: 'Data de aniversário',
            width: 180,
        },
        {
            field: 'telefone',
            headerName: 'Telefone',
            width: 132,
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
                        <MatRemove index={params.row.id} table={'funcionarios'} refresh={() => { setRefreshListaFuncionarios(!refreshListaFuncionarios) }} />
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
        var dataAtual = new Date();
        var dia = String(dataAtual.getDate()).padStart(2, '0');
        var mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        var ano = dataAtual.getFullYear();
        var date = ano + '-' + mes + '-' + dia;

        setDataAdmissao(date)
        setDataAniversario(date)
    }, [])

    useEffect(() => {
        async function buscaFuncionarios() {
            setLoadingRegistros(true);
            let { data, error } = await supabase.from('funcionarios').select().order('id', { ascending: true })

            if (error) {
                setLoadingRegistros(false);
                alert(error.message)
                return;
            };

            let array = [];

            data.forEach(funcionario => {
                array.push(
                    {
                        id: funcionario.id,
                        nome: funcionario.nome,
                        endereco: funcionario.endereco,
                        dataAdmissao: formatDate(funcionario.dataAdmissao),
                        dataAniversario: formatDate(funcionario.dataAniversario),
                        telefone: funcionario.telefone,
                        dataAdmissaoUnformated: funcionario.dataAdmissao,
                        dataAniversarioUnformated: funcionario.dataAniversario,
                    }
                );
            });
            setLoadingRegistros(false);
            setRows(array);
        }

        if (value === 1) {
            setRows([
                {
                    id: '',
                    nome: '',
                    endereco: '',
                    dataAdmissao: '',
                    dataAniversario: '',
                    telefone: '',
                    dataAdmissaoUnformated: '',
                    dataAniversarioUnformated: ''
                },
            ]);
            buscaFuncionarios()
        }

    }, [value, refreshListaFuncionarios])


    async function clearInputs() {
        setNome('');

        setDataAdmissao(getDataAtualEUA());
        setDataAniversario(getDataAtualEUA());
        setEndereco('');
        setTelefone('');
        setCodigo('');

    }

    async function handleSalvar(event) {
        event.preventDefault();

        if (nome.trim() === '') {
            alert("Digite o nome do funcionário");
            return;
        }

        let funcionario = {}

        if (String(codigo).trim() !== '') {
            funcionario = ({
                id: codigo,
                nome: nome,
                endereco: endereco,
                dataAdmissao: dataAdmissao,
                dataAniversario: dataAniversario,
                telefone: telefone,
            });
        } else {
            funcionario = ({
                nome: nome,
                endereco: endereco,
                dataAdmissao: dataAdmissao,
                dataAniversario: dataAniversario,
                telefone: telefone,
            });
        }

        setLoading(true);
        let retorno = await supabase.from('funcionarios').upsert(funcionario)

        if (retorno.error) {
            alert(retorno.error.message);
            setLoading(false);
            return;

        } else {
            alert('Salvo!');
            setLoading(false);
            clearInputs();
            document.getElementById("nomeFuncionario").focus()
        }

    }

    async function handleEditar(reg, event) {
        setCodigo(reg.row.id);
        setNome(reg.row.nome);
        setEndereco(reg.row.endereco);
        setDataAdmissao(reg.row.dataAdmissaoUnformated);
        setDataAniversario(reg.row.dataAniversarioUnformated);
        setTelefone(reg.row.telefone);
        handleChangeTab('', 0);
    }


    const handleChangeTab = (event, newValue) => {
        if (newValue === 1) {
            clearInputs();
        }
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
        <div className="containerCadFuncionarios" >
            <TopTitle title="Cadastro de Funcionários"></TopTitle>

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
                        <TextField id="idFuncionario" disabled className={classes.lblId} onChange={event => setCodigo(event.target.value)} value={codigo} size="small" label="Código" variant="outlined" />
                        <TextField id="nomeFuncionario" className={classes.lblNome} onChange={event => setNome(event.target.value)} value={nome} size="small" label="Nome" variant="outlined" />
                        <TextField id="endFuncionario" className={classes.lblEndereco} onChange={event => setEndereco(event.target.value)} value={endereco} size="small" label="Endereço" variant="outlined" />
                        <NumberFormat
                            customInput={TextField}
                            id="idTelefone"
                            size="small"
                            label="Celular"
                            onValueChange={values => setTelefone(values.formattedValue)}
                            value={telefone}
                            variant="outlined"
                            format="(##) #####-####"
                            mask="_"
                        />

                        <TextField id="lblDataAdimissao" type="date" size="small" label="Data de Adimissão" onChange={event => setDataAdmissao(event.target.value)} value={dataAdmissao} variant="outlined" />
                        <TextField
                            size="small"
                            type="date"
                            label="Data de aniversário"
                            onChange={event => setDataAniversario(event.target.value)} value={dataAniversario}
                            variant="outlined"
                            id="formatted-numberformat-input"

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