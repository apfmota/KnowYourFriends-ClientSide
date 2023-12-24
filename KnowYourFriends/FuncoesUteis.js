import Images from "./assets/Images";

exports.iconeAmigoUrl = (amigo) => {
    if (amigo !== undefined) {
        return `http://192.168.1.110:3000/icone-amigo?filename=${amigo.id_galera}_${amigo.posicao}`;
    } else {
        return "";
    }
}

exports.iconeAmigo = (amigo, desvirado) => {
    if (desvirado) {
        return {
            uri: exports.iconeAmigoUrl(amigo)
        }
    } else {
        return Images.cartaVerso;
    }
}
