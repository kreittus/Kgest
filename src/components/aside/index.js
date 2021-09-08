
import { useState } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { useHistory } from 'react-router-dom';

import logoEmpresa from '../../assets/images/logoMartins.png'

import '../../styles/aside.scss'

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const history = useHistory();
    return (
        <aside>
            <ProSidebar breakPoint="md" className="aside" collapsed={collapsed}>
                <SidebarHeader className="logoEmpresa" onClick={() => { setCollapsed(!collapsed) }} >
                    <div>
                        <img src={logoEmpresa} height="150px" width="150px" />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="square">
                        <SubMenu title="Cadastros" >
                            <MenuItem onClick={() => { history.push('/cadastroProduto') }}>Produtos</MenuItem>
                            <MenuItem>Funcionarios</MenuItem>
                            <MenuItem>Clientes</MenuItem>
                        </SubMenu>
                        <SubMenu title="Movimentações" >
                            <MenuItem>Vendas</MenuItem>
                            <MenuItem>Compras</MenuItem>
                        </SubMenu>
                        <SubMenu title="Relatórios" >
                            <MenuItem>Vendas</MenuItem>
                            <MenuItem>Compras</MenuItem>
                        </SubMenu>
                    </Menu>
                </SidebarContent>
            </ProSidebar>

        </aside>
    );
}
