import { formatDate } from "../../services/functions";


export class Impressao {

    constructor(dadosParaImpressao, tipo, dataInicial, dataFinal, order) {
        this.dadosParaImpressao = dadosParaImpressao;
        this.tipo = tipo; // C - Compra, V - Venda, E - Estoque
        this.dataInicial = tipo !== 'E' ? formatDate(dataInicial) : '';
        this.dataFinal = tipo !== 'E' ? formatDate(dataFinal) : '';
        this.order = order;

    }

    async PreparaDocumento() {
        const corpoDocumento = this.CriaCorpoDocumento();
        const documento = this.GerarDocumento(corpoDocumento);
        return documento;
    }
    async PreparaDocumentoEstoque() {
        const corpoDocumento = this.CriaCorpoDocumentoEstoque();
        const documento = this.GerarDocumento(corpoDocumento);
        return documento;
    }

    CriaCorpoDocumentoEstoque() {
        let arrayBody = [];
        let spanCol = 3;
        const header = [
            { text: 'ID Produto', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'Produto', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'Quantidade', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
        ];

        const lineHeader = [
            {
                text:
                    '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                alignment: 'center',
                fontSize: 5,
                colSpan: spanCol,
            },
            {},
            {},
        ];

        for (let i = 0; i <= (this.dadosParaImpressao.length - 1); i++) {
            arrayBody.push([
                { text: this.dadosParaImpressao[i].id, fontSize: 8 },
                { text: this.dadosParaImpressao[i].descricao, fontSize: 8 },
                { text: this.dadosParaImpressao[i].estoqueProd, fontSize: 8 },
            ]);
        }

        let content = [header, lineHeader];
        content = [...content, ...arrayBody];
        return content;

    }


    CriaCorpoDocumento() {
        const header = [
            { text: 'Nº Venda', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'Produto', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'Funcionário', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'Data', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'QTDE', bold: true, fontSize: 9, alignment: 'right', margin: [0, 4, 0, 0] },
            { text: `${this.tipo === 'CX' ? 'Centro de custo' : ''}`, bold: true, fontSize: 9, alignment: 'right', margin: [0, 4, 0, 0] },
            { text: `${this.tipo === 'C' ? 'Centro de custo' : 'Forma de pagamento'}`, bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
            { text: 'Valor', bold: true, alignment: 'right', fontSize: 9, margin: [0, 4, 0, 0] },

        ];
        let valorTotal = 0;
        let valorTotalVenda = 0;
        let valorTotalCompra = 0;
        let valorParcialCompra = 0;
        let valorParcialVenda = 0;
        let arrayBody = [];;
        let qtdeTotalProduto = 0
        let produtosContados = [];
        let order = this.order
        let obj = this.dadosParaImpressao[0]
        let campoOrder = obj[order]
        let spanCol = 8

        // Monta colunas analiticas de vendas (corpo principal)
        for (let i = 0; i <= (this.dadosParaImpressao.length - 1); i++) {
            obj = this.dadosParaImpressao[i]
            if (campoOrder !== obj[order]) {
                campoOrder = obj[order];
                i--
                arrayBody.push([
                    { text: '', colSpan: spanCol, }
                ]);

                if (this.tipo === 'CX') {
                    arrayBody.push([
                        { text: `Total Compras: ${valorParcialCompra.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, style: `${this.tipo === 'CX' ? 'compra' : ''}` }
                    ]);
                    arrayBody.push([
                        { text: `Total Vendas: ${valorParcialVenda.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, style: `${this.tipo === 'CX' ? 'venda' : ''}` }
                    ]);
                } else {
                    arrayBody.push([
                        { text: `Total: ${valorTotal.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, }
                    ]);

                }


                arrayBody.push([
                    {
                        text:
                            '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                        alignment: 'center',
                        fontSize: 5,
                        colSpan: spanCol,
                    },
                    {},
                    {},
                ]);
                valorTotal = 0;
                valorParcialCompra = 0;
                valorParcialVenda = 0;

            } else {
                campoOrder = obj[order];


                valorTotal = valorTotal + this.dadosParaImpressao[i].valorTotalItem;
                switch (this.dadosParaImpressao[i].tipoMov) {
                    case 'C':
                        valorTotalCompra += this.dadosParaImpressao[i].valorTotalItem;
                        valorParcialCompra += this.dadosParaImpressao[i].valorTotalItem;
                        break;
                    case 'V':
                        valorTotalVenda += this.dadosParaImpressao[i].valorTotalItem;
                        valorParcialVenda += this.dadosParaImpressao[i].valorTotalItem;
                        break;
                    default:
                        valorTotalCompra += 0;
                        valorTotalVenda += 0;
                        valorParcialCompra += 0;
                        valorParcialVenda += 0;
                        break;

                }
                arrayBody.push([
                    { text: this.dadosParaImpressao[i].idMovi, fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: this.dadosParaImpressao[i].produto, fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: this.dadosParaImpressao[i].funcionario, fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: formatDate(this.dadosParaImpressao[i].dataMovi), fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: this.dadosParaImpressao[i].qtde, alignment: 'right', fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].centroCusto : ''}`, alignment: 'right', fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: `${this.tipo === 'C' ? this.dadosParaImpressao[i].centroCusto : this.dadosParaImpressao[i].descFormaPagamento} `, fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    { text: this.dadosParaImpressao[i].valorTotalItem.toFixed(2).replace('.', ','), alignment: 'right', fontSize: 8, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[i].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                ])
            };

            if (i === (this.dadosParaImpressao.length - 1)) {
                arrayBody.push([
                    { text: '', colSpan: spanCol, }
                ]);

                if (this.tipo === 'CX') {
                    arrayBody.push([
                        { text: `Total Compras: ${valorParcialCompra.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, style: `${this.tipo === 'CX' ? 'compra' : ''}` }
                    ]);
                    arrayBody.push([
                        { text: `Total Vendas: ${valorParcialVenda.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, style: `${this.tipo === 'CX' ? 'venda' : ''}` }
                    ]);
                } else {
                    arrayBody.push([
                        { text: `Total: ${valorTotal.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, }
                    ]);

                }

                arrayBody.push([
                    {
                        text:
                            '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                        alignment: 'center',
                        fontSize: 5,
                        colSpan: spanCol,
                    },
                    {},
                    {},
                ]);
                valorTotal = 0;
                valorParcialCompra = 0;
                valorParcialVenda = 0;
            }

        }

        arrayBody.push([
            { text: '', colSpan: spanCol, }
        ]);
        arrayBody.push([
            { text: '', colSpan: spanCol, }
        ]);


        // Monta colunas de quantidades totais

        let formasIncludes = [];
        let qtdeForma = 0;

        for (let c = 0; c <= (this.dadosParaImpressao.length - 1); c++) {
            if (!produtosContados.includes((this.dadosParaImpressao[c].idProd + this.dadosParaImpressao[c].tipoMov))) {
                for (let i = 0; i <= (this.dadosParaImpressao.length - 1); i++) {

                    if ((this.dadosParaImpressao[c].idProd + this.dadosParaImpressao[c].tipoMov) === (this.dadosParaImpressao[i].idProd + this.dadosParaImpressao[i].tipoMov)) {
                        qtdeTotalProduto += this.dadosParaImpressao[i].qtde
                    }
                }
            }
            if (!produtosContados.includes((this.dadosParaImpressao[c].idProd + this.dadosParaImpressao[c].tipoMov))) {

                arrayBody.push(
                    [
                        { text: `${this.dadosParaImpressao[c].produto} - QTDE Total: ${qtdeTotalProduto} `, bold: true, alignment: 'left', fontSize: 8, colSpan: spanCol, style: `${this.tipo === 'CX' ? this.dadosParaImpressao[c].tipoMov === 'C' ? 'compra' : 'venda' : ''}` },
                    ]
                );
                produtosContados.push(this.dadosParaImpressao[c].idProd + this.dadosParaImpressao[c].tipoMov)
                qtdeTotalProduto = 0;
                qtdeForma = 0;

            }

        }

        arrayBody.push([
            { text: '', colSpan: spanCol, }
        ]);


        for (let i = 0; i <= (this.dadosParaImpressao.length - 1); i++) {
            if (!formasIncludes.includes(this.dadosParaImpressao[i].idFormaPagamento)) {
                for (let c = 0; c < this.dadosParaImpressao.length; c++) {
                    if (this.dadosParaImpressao[i].idFormaPagamento === this.dadosParaImpressao[c].idFormaPagamento && this.dadosParaImpressao[i].tipoMov === 'V') {
                        qtdeForma++;
                    }

                }
                if (this.dadosParaImpressao[i].tipoMov === 'V') {
                    arrayBody.push(
                        [
                            { text: `${this.dadosParaImpressao[i].descFormaPagamento} - QTDE Total: ${qtdeForma} `, bold: true, alignment: 'left', fontSize: 8, colSpan: spanCol },
                        ]
                    );

                    formasIncludes.push(this.dadosParaImpressao[i].idFormaPagamento);
                    qtdeForma = 0;
                }


            }

        }

        arrayBody.push([
            { text: '', colSpan: spanCol, }
        ]);


        if (this.tipo === 'C' || this.tipo === 'CX') {
            arrayBody.push(
                [
                    { text: `Total Compras: ${valorTotalCompra.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, style: `${this.tipo === 'CX' ? 'compra' : ''}` },
                ]
            );
        }

        if (this.tipo === 'V' || this.tipo === 'CX') {
            arrayBody.push(
                [
                    { text: `Total Vendas: ${valorTotalVenda.toFixed(2).replace('.', ',')}`, bold: true, alignment: 'right', fontSize: 9, colSpan: spanCol, style: `${this.tipo === 'CX' ? 'venda' : ''}` },
                ]
            );
        }


        const lineHeader = [
            {
                text:
                    '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                alignment: 'center',
                fontSize: 5,
                colSpan: spanCol,
            },
            {},
            {},
        ];


        let content = [header, lineHeader];
        content = [...content, ...arrayBody];

        return content;
    }

    GerarDocumento(corpoDocumento) {
        let titulo = '';

        switch (this.tipo) {
            case 'C':
                titulo = 'COMPRA';
                break;
            case 'V':
                titulo = 'VENDA';
                break;
            case 'CX':
                titulo = 'CAIXA';
                break;
            case 'E':
                titulo = 'ESTOQUE';
                break;
            default:
                titulo = '';
                break;

        }

        let inicialData = this.dataInicial;
        let finalData = this.dataFinal;
        const documento = {
            pageSize: 'A4',
            pageMargins: [14, 53, 14, 48],
            /* header: function () {
                return {
                    margin: [14, 12, 14, 0],
                    layout: 'noBorders',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                { text: `RELATÓRIO DE ${titulo} `, style: 'reportName' },
                            ],
                            [{ text: `${inicialData} - ${finalData} `, style: 'reportName' },]
                        ],
                    },
                };
            }, */
            content: [

                {
                    margin: [14, -40, 14, 12],
                    layout: 'noBorders',
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                { text: `RELATÓRIO DE ${titulo} `, style: 'reportName' },
                            ],
                            this.tipo !== 'E' ? [{ text: `${inicialData} - ${finalData} `, style: 'reportName' },] : [{ text: '' }]
                        ],
                    },
                },

                {
                    layout: 'noBorders',
                    table: {
                        headerRows: 0,
                        widths: this.tipo !== 'E' ? ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'] : ['auto', 'auto', 'auto'],

                        body: corpoDocumento,
                    },
                },
            ],
            footer(currentPage, pageCount) {
                return {
                    layout: 'noBorders',
                    margin: [14, 0, 14, 22],
                    table: {
                        widths: ['auto'],
                        body: [
                            [
                                {
                                    text:
                                        '______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                                    alignment: 'center',
                                    fontSize: 5,
                                },
                            ],
                            [
                                [
                                    {
                                        text: `Página ${currentPage.toString()} de ${pageCount} `,
                                        fontSize: 7,
                                        alignment: 'right',
                                        /* horizontal, vertical */
                                        margin: [3, 0],
                                    },
                                    {
                                        text: "© Martin's Barbearia",
                                        fontSize: 7,
                                        alignment: 'center',
                                    },
                                ],
                            ],
                        ],
                    },
                };
            },
            styles: {
                reportName: {
                    fontSize: 9,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 4, 0, 0],
                },
                venda: {
                    color: 'green',
                },
                compra: {
                    color: 'red',
                }
            },

        };
        return documento;
    }
}