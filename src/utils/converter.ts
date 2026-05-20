import { catalogo } from "../interfaces/Moedas";

export const converter = (valor: number, de: string, para: string) => {
    if (!valor || !de || !para) return "0.00";
    const valorEmDolar = valor / catalogo[de].taxaCambio;
    const resultado = (valorEmDolar * catalogo[para].taxaCambio).toFixed(2);
    return resultado;
};