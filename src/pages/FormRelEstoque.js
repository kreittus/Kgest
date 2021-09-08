import { useEffect, useState } from "react";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { TopTitle } from "../components/topTitle";
import { supabase } from "../services/supabase";
import { Impressao } from "../components/Impressao";

import Autocomplete from "@material-ui/lab/Autocomplete";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        '& > *': {
            margin: theme.spacing(3),
        },
    },
}))



export function FormRelEstoque() {
    const [zerarAutoComplete, setZerarAutoComplete] = useState(false);
    const [dataProdutos, setDataProdutos] = useState([]);
    const [produtosFilter, setProdutosFilter] = useState({});

    const classes = useStyles();

    useEffect(() => {
        async function loadingProducts() {
            let retorno = await supabase.from('products').select().eq('tipoProd', 'P');

            let products = retorno.data
            let arrayItens = [];

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

        loadingProducts();

    }, []);


    async function handleGerarRelatorio(e) {
        e.preventDefault();

        let dados = [];

        if (produtosFilter.length > 0) {
            for (let i = 0; i <= (produtosFilter.length - 1); i++) {
                let { data, error } = await supabase
                    .from('products')
                    .select()
                    .eq('id', produtosFilter[i].id);

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
                .from('products')
                .select()
                .eq('tipoProd', 'P')
                .order('id', { ascending: true });

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
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            const classeImpressao = new Impressao(dados, 'E', '', '', '');
            const documento = await classeImpressao.PreparaDocumentoEstoque();
            pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
            clearFilters();

        } else {
            alert("Registros não encontrados.");
            return
        }
    }

    async function clearFilters() {
        setProdutosFilter('');
        setZerarAutoComplete(!zerarAutoComplete);
    }

    return (


        <div className="containerRelEstoque">
            <TopTitle title="Relatório de Estoque" ></TopTitle>

            <form className={classes.root} onSubmit={handleGerarRelatorio} >
                <div>
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

                <div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Gerar
                    </Button>
                </div>
            </form>
        </div>
    );
}