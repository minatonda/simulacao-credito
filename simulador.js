function toFixed(valor) {
    return parseFloat(valor.toFixed(2));
}

function calcularSimulacao(emprestimo, numParcelas, jurosEmprestimo, jurosSaldoDevedor, parcelaFixa, parcelas) {
    emprestimo = emprestimo || 0
    numParcelas = numParcelas || 0;
    parcelaFixa = toFixed(parcelaFixa || emprestimo / numParcelas);
    jurosEmprestimo = jurosEmprestimo === undefined ? 0 : jurosEmprestimo
    jurosSaldoDevedor = jurosSaldoDevedor === undefined ? 0 : jurosSaldoDevedor;

    parcelas = parcelas ? parcelas.concat(new Array(numParcelas - parcelas.length).fill(parcelaFixa)) : new Array(numParcelas).fill(parcelaFixa);

    return parcelas.reduce((i, c, idx) => {
        if (i.length) {
            const last = [...i].pop();
            if (last.devedor > 0) {
                const valorJurosDevedor = toFixed(last.devedor > 0 ? last.devedor * (jurosSaldoDevedor / 100) : 0);
                const valorJurosEmprestimo = toFixed(emprestimo * (jurosEmprestimo / 100));
                const valorPagoJurosMes = toFixed(valorJurosEmprestimo + valorJurosDevedor);
                let valorPagoMes = last.devedor < c ? last.devedor : c;
                i.push({
                    anterior: last.devedor,
                    parcela: idx + 1,
                    valorParcela: c,
                    valorJurosEmprestimo: valorJurosEmprestimo,
                    valorJurosDevedor: valorJurosDevedor,
                    valorPagoJurosMes: valorPagoJurosMes,
                    valorPagoMes: valorPagoMes,
                    valorPagoTotalMes: valorPagoJurosMes + valorPagoMes,
                    devedor: toFixed(last.devedor - valorPagoMes)
                });
            }

        } else {
            const valorJurosDevedor = toFixed(emprestimo * (jurosSaldoDevedor / 100));
            const valorJurosEmprestimo = toFixed(emprestimo * (jurosEmprestimo / 100));
            const valorPagoJurosMes = toFixed(valorJurosEmprestimo + valorJurosDevedor);
            let valorPagoMes = emprestimo < c ? emprestimo : c;

            i.push({
                anterior: emprestimo,
                parcela: idx + 1,
                valorParcela: c,
                valorJurosEmprestimo: valorJurosEmprestimo,
                valorJurosDevedor: valorJurosDevedor,
                valorPagoJurosMes: valorPagoJurosMes,
                valorPagoMes: valorPagoMes,
                valorPagoTotalMes: valorPagoJurosMes + valorPagoMes,
                devedor: toFixed(emprestimo - valorPagoMes)
            });
        }
        return i;
    }, []);

}

function calcularRetorno(simulacao) {
    return simulacao.reduce((i, c) => {
        i['valorJurosEmprestimo'] += c['valorJurosEmprestimo'];
        i['valorJurosDevedor'] += c['valorJurosDevedor'];
        return i;
    }, {
        valorJurosEmprestimo: 0,
        valorJurosDevedor: 0
    });
}

const simulacao = calcularSimulacao(39900, 20, 0, 3);
const retorno = calcularRetorno(simulacao);

console.log('Simulação', simulacao);
console.log('Retorno', retorno);
