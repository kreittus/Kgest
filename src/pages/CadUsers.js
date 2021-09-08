import { useEffect } from 'react'
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

export function CadUsers() {
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [password, setPassword] = useState('');
    const [value, setValue] = useState(0);
    const [refreshListaRegistros, setRefreshListaRegistros] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRegistros, setLoadingRegistros] = useState(false);

    const [rows, setRows] = useState([
        { id: '', descricao: '', password: '' },
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
            field: 'user',
            headerName: 'Descrição',
            width: 730,
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
                        <MatRemove index={params.row.id} table={'users'} refresh={() => { setRefreshListaRegistros(!refreshListaRegistros) }} />
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
            let { data, error } = await supabase.from('users').select().neq('tipo', 'Master').order('id', { ascending: true })

            if (error) {
                setLoadingRegistros(false);
                alert(error.message)
                return;
            };

            let arrayItens = [];

            data.forEach(reg => {
                arrayItens.push(
                    {
                        id: reg.id,
                        user: reg.user,
                        password: reg.password,
                    }
                );
            });
            setLoadingRegistros(false);
            setRows(arrayItens);
        }

        if (value === 1) {
            setRows([
                { id: '', descricao: '', password: '' },
            ]);
            buscaItens();
        }

    }, [value, refreshListaRegistros])

    async function handleSalvar(event) {
        event.preventDefault();

        if (descricao.trim() === '') {
            alert("Digite a descrição.")
            return;
        }
        if (password.trim() === '') {
            alert("Digite a senha.")
            return;
        }

        let registro = {};

        if (String(codigo).trim() !== '') {
            registro = ({
                id: codigo,
                user: descricao,
                password: password,
            });
        } else {
            registro = ({
                user: descricao,
                password: password,
            });
        }

        setLoading(true);
        let retorno = await supabase.from('users').upsert(registro)

        if (retorno.error) {
            setLoading(false);
            alert(retorno.error.message);
            return;

        } else {
            setLoading(false);
            alert('Salvo!')
            clearInputs();
            document.getElementById("descricao").focus()
        }

    }

    async function handleEditar(reg, event) {
        setCodigo(reg.row.id)
        setDescricao(reg.row.user)
        setPassword(reg.row.password)

        handleChangeTab('', 0);
    }

    async function clearInputs() {
        setCodigo('');
        setDescricao('');
        setPassword('');

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
        <div className="containerCadastro" >
            <TopTitle title="Cadastro de Usuários"></TopTitle>

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

                        <TextField
                            size="small"
                            label="Senha"
                            onChange={event => setPassword(event.target.value)}
                            value={password}
                            variant="outlined"
                            id="idpassword"
                            type="password"
                            onClick={() => { document.getElementById("idpassword").select() }}
                            onBlur={() => { if (String(password).trim() === '') { setPassword('') } }}

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