// import React from "react";

import BRL from '../../assets/BRL.svg';
import CNY from '../../assets/CNY.svg';
import EUR from '../../assets/EUR.svg';
import GBP from '../../assets/GBP.svg';
import JPY from '../../assets/JPY.svg';
import USD from '../../assets/USD.svg';
export interface Moeda {
    taxaCambio: number;
    imagenMoeda: any;
}

export const catalogo: Record<string, Moeda> = {
    dolar: { taxaCambio: 1.0, imagenMoeda: USD },
    real: { taxaCambio: 5.02773, imagenMoeda: BRL },
    canadense: { taxaCambio: 1.37, imagenMoeda: CNY },
    euro: { taxaCambio: 0.93, imagenMoeda: EUR },
    yen: { taxaCambio: 157.50, imagenMoeda: JPY },
    libra: { taxaCambio: 0.80, imagenMoeda: GBP }
};