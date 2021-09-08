export function formatDate(date) {
    var dia = String(date).substr(8, 10);
    var mes = String(date).substr(5, 2);
    var ano = String(date).substr(0, 4);
    var dataFormatada = dia + '/' + mes + '/' + ano;
    return dataFormatada
}

export function getDataAtualEUA() {
    var dataAtual = new Date();
    var dia = String(dataAtual.getDate()).padStart(2, '0');
    var mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    var ano = dataAtual.getFullYear();
    var date = ano + '-' + mes + '-' + dia;
    return date;

}