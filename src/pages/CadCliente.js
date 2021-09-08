import { useEffect, useState } from 'react'
import { TopTitle } from "../components/topTitle";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, LinearProgress, useMediaQuery } from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { supabase } from '../services/supabase'
import { formatDate, getDataAtualEUA } from '../services/functions';
import { MatRemove } from '../components/MatRemove';
import { ButtonPsl } from '../components/ButtonPsl/Index';

import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
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



export function CadCliente() {
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataAniversario, setDataAniversario] = useState(getDataAtualEUA());
    const [telefone, setTelefone] = useState();
    const [endereco, setEndereco] = useState('');
    const [value, setValue] = useState(0);
    const [refreshListaClientes, setRefreshListaClientes] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRegistros, setLoadingRegistros] = useState(false);

    const [rows, setRows] = useState([
        {
            id: '',
            name: '',
            endereco: '',
            dataAniversario: '',
            telefone: '',
            email: '',
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
            field: 'name',
            headerName: 'Nome',
            width: 200,
        },
        {
            field: 'endereco',
            headerName: 'Endereço',
            width: 240,
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
            field: 'email',
            headerName: 'Email',
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
                        <MatRemove index={params.row.id} table={'clientes'} refresh={() => { setRefreshListaClientes(!refreshListaClientes) }} />
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
        async function buscaClientes() {
            setLoadingRegistros(true);
            let { data, error } = await supabase.from('clientes').select().order('id', { ascending: true })

            if (error) {
                setLoadingRegistros(false);
                alert(error.message)
                return;
            };

            let array = [];

            data.forEach(cliente => {
                array.push(
                    {
                        id: cliente.id,
                        name: cliente.name,
                        endereco: cliente.endereco,
                        dataAniversario: cliente.dataAniversario !== null ? formatDate(cliente.dataAniversario) : '',
                        telefone: cliente.telefone,
                        email: cliente.email,
                        dataAniversarioUnformated: cliente.dataAniversario,
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
                    name: '',
                    endereco: '',
                    dataAniversario: '',
                    telefone: '',
                    email: '',
                    dataAniversarioUnformated: ''
                },
            ]);
            buscaClientes()
        }

    }, [value, refreshListaClientes])



    async function clearInputs() {
        setNome('');
        setCodigo('');
        setDataAniversario('');
        setEndereco('');
        setTelefone('');
        setEmail('');

    }

    async function handleSalvar(event) {
        event.preventDefault();

        if (nome.trim() === '') {
            alert("Digite o nome do Cliente");
            return;
        }

        let cliente = {};

        if (String(codigo).trim() !== '') {
            cliente = ({
                id: codigo,
                name: nome,
                endereco: endereco,
                dataAniversario: dataAniversario == null ? dataAniversario : dataAniversario.trim() !== '' ? dataAniversario : null,
                telefone: telefone,
                email: email,
            });

        } else {
            cliente = ({
                name: nome,
                endereco: endereco,
                dataAniversario: dataAniversario.trim() === '' ? null : dataAniversario,
                telefone: telefone,
                email: email,
            });

        }


        setLoading(true);
        let retorno = await supabase.from('clientes').upsert(cliente)

        if (retorno.error) {
            alert(retorno.error.message);
            setLoading(false);
            return;

        } else {
            alert('Salvo!')
            setLoading(false);
            clearInputs();
            document.getElementById("nomeCliente").focus()
        }

    }

    async function handleEditar(reg, event) {
        setCodigo(reg.row.id);
        setNome(reg.row.name);
        setEndereco(reg.row.endereco);
        setDataAniversario(reg.row.dataAniversarioUnformated);
        setTelefone(reg.row.telefone);
        setTelefone(reg.row.email);
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
            <TopTitle title="Cadastro de Clientes"></TopTitle>

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
                        <TextField id="idCliente" disabled className={classes.lblId} onChange={event => setCodigo(event.target.value)} value={codigo} size="small" label="Código" variant="outlined" />
                        <TextField id="nomeCliente" className={classes.lblNome} onChange={event => setNome(event.target.value)} value={nome} size="small" label="Nome" variant="outlined" />
                        <TextField id="endCliente" className={classes.lblEndereco} onChange={event => setEndereco(event.target.value)} value={endereco} size="small" label="Endereço" variant="outlined" />

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
                        <TextField
                            id="idEmail"
                            size="small"
                            label="Email"
                            onChange={event => setEmail(event.target.value)}
                            value={email}
                            variant="outlined"
                        />

                        <TextField
                            size="small"
                            type="date"
                            label="Data de aniversário"
                            onChange={event => setDataAniversario(event.target.value)}
                            value={dataAniversario}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}

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