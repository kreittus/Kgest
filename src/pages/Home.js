import { useState, useContext, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { CadProd } from './CadProd';
import { CadFunc } from './CadFunc';
import { FormRelEstoque } from './FormRelEstoque';
import { CadFormaPagamento } from './CadFormaPagamento';
import { CadUsers } from './CadUsers';
import { CadCentroCusto } from './CadCentroCusto';
import { CadCliente } from './CadCliente';
import { Movimento } from '../components/Movimentos/Index';
import { FormRelatorios } from '../components/FormRelatorios/Index';
import { useHistory } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { userContext } from '../App';

import useMediaQuery from '@material-ui/core/useMediaQuery';


import logoEmpresa from '../assets/images/logoMartins.png'
import KGestLogo from '../assets/images/KGestLogo.png'
import KGestBarra from '../assets/images/logoK.png'


import '../styles/home.scss'


export function Home() {

    const [collapsedcadastros, setCollapsedcadastros] = useState(false)
    const [collapsedMovimentacoes, setCollapsedMovimentacoes] = useState(false)
    const [collapsedRelatorios, setCollapsedRelatorios] = useState(false)
    const [toggled, setToggled] = useState(false)
    const [cad, setCad] = useState(0)
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const celResolution = useMediaQuery(theme.breakpoints.down('sm'));


    const { userLogin, setUserLogin } = useContext(userContext);
    const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        relCaixa: {
            height: matches ? '140vh' : '105vh',
        },
        movVendas: {
            height: matches ? '200vh' : '100vh',
        },
        movCompras: {
            height: matches ? '200vh' : '100vh',
        },
        cadProd: {
            height: matches ? '140vh' : '100vh',
        },
        cadFuncionario: {
            height: matches ? '140vh' : '100vh',
        },
        main: {
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
        },
        waterMark: {
            opacity: '0.2',
        },

    }));


    const classes = useStyles();

    useEffect(() => {
        if (userLogin <= 0) {
            history.push('/');
            return;
        }
    }, [history, userLogin]);


    async function logout() {
        setUserLogin([]);
        history.push('/');
    };

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    async function changOptionMenu(option) {
        setCad(option);
        if (celResolution) {
            handleToggleSidebar(false)
        };

    }

    return (
        <div className="containerHome">
            <aside className={classes[cad]} >
                <ProSidebar breakPoint="md" className="aside" toggled={toggled} onToggle={handleToggleSidebar} >
                    <SidebarHeader className="logoEmpresa" >
                        <div>
                            {userLogin[0].empresa === 0 ?
                                <img alt="logo" src={KGestBarra} height="150px" width="150px" />
                                :
                                <img alt="logo" src={logoEmpresa} height="150px" width="150px" />
                            }



                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <Menu iconShape="square" >
                            <SubMenu title="Cadastros" open={collapsedcadastros} onOpenChange={value => { setCollapsedcadastros(!collapsedcadastros); setCollapsedMovimentacoes(false); setCollapsedRelatorios(false); }} >
                                <MenuItem onClick={() => { changOptionMenu('cadProd') }}>Produtos</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('cadFuncionario') }}>Funcionarios</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('cadCliente') }} >Clientes</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('cadFormaPagamento') }} >Formas de Pagamento</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('cadCentroCusto') }} >Centro de custo</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('cadUsers') }} >Usuários</MenuItem>
                            </SubMenu>
                            <SubMenu title="Movimentações" open={collapsedMovimentacoes} onOpenChange={value => { setCollapsedMovimentacoes(!collapsedMovimentacoes); setCollapsedcadastros(false); setCollapsedRelatorios(false); }} >
                                <MenuItem onClick={() => { changOptionMenu('movVendas') }} >Vendas</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('movCompras') }} >Compras</MenuItem>
                            </SubMenu>
                            <SubMenu title="Relatórios" open={collapsedRelatorios} onOpenChange={value => { setCollapsedRelatorios(!collapsedRelatorios); setCollapsedMovimentacoes(false); setCollapsedcadastros(false); }} >
                                <MenuItem onClick={() => { changOptionMenu('relVendas') }} >Vendas</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('relCompras') }} >Compras</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('relCaixa') }} >Caixa</MenuItem>
                                <MenuItem onClick={() => { changOptionMenu('relEstoque') }} >Estoque</MenuItem>
                            </SubMenu>
                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Menu>
                            <MenuItem onClick={logout} >Logout</MenuItem>
                        </Menu>
                    </SidebarFooter>
                </ProSidebar>

            </aside>
            <main className={classes[cad]}>
                <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
                    <FaBars />
                </div>
                {cad === 'cadProd' ? < CadProd ></CadProd> :
                    cad === 'cadFuncionario' ? <CadFunc></CadFunc> :
                        cad === 'cadCliente' ? < main ><CadCliente></CadCliente></main> :
                            cad === 'cadUsers' ? < main ><CadUsers></CadUsers></main> :
                                cad === 'cadFormaPagamento' ? < main ><CadFormaPagamento></CadFormaPagamento></main> :
                                    cad === 'cadCentroCusto' ? < main ><CadCentroCusto></CadCentroCusto></main> :
                                        cad === 'movVendas' ? <Movimento tipo="V" title="Vendas" ></Movimento> :
                                            cad === 'movCompras' ? <Movimento tipo="C" title="Compras" ></Movimento> :
                                                cad === 'relVendas' ? <FormRelatorios tipo="V" title="Relatório de vendas" ></FormRelatorios> :
                                                    cad === 'relCompras' ? <FormRelatorios tipo="C" title="Relatório de Compras" ></FormRelatorios> :
                                                        cad === 'relCaixa' ? <FormRelatorios tipo="CX" title="Relatório de Caixa" ></FormRelatorios> :
                                                            cad === 'relEstoque' ? <FormRelEstoque></FormRelEstoque>
                                                                : <main className={classes.main}>
                                                                    <div>
                                                                        <img className={classes.waterMark} alt="logo" src={KGestLogo} height="500px" width="350px" />
                                                                    </div>
                                                                </main>
                }
            </main>
        </div >
    );
}