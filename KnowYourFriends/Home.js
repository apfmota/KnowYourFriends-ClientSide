import React, { useState, useEffect } from 'react';
import {Dimensions, Text, Pressable, View, TextInput, StyleSheet, ScrollView } from 'react-native';
export default function Home ({navigation, route}) {
    const [galeras, setGaleras] = useState([]);
    const [idGaleraEscolhida, setIdGaleraEscolhida] = useState(null);
    const [codigoPartida, setCodigoPartida] = useState(null);
    const [codigoEntrar, setCodigoEntrar] = useState(null);
    const [partidaNaoEncontrada, setPartidaNaoEncontrada] = useState(false);
    const [criandoPartida, setCriandoPartida] = useState(false);
    const [encontrandoPartida, setEncontrandoPartida] = useState(false);


    const styles = StyleSheet.create({
        input: {
            height: 50,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            width: 100,
            textAlign: 'center',
            alignSelf: 'center'
        },
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        },
        galeras: {
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#edf0d1',
            padding: 10,
            margin: 5
        },
        galeraContainer: {
            margin: 5,
            borderRadius: 10,
            backgroundColor: '#cccccc',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
        },
        botaoGalera: {
            borderRadius: 5,
            height: 30,
            width: 30,
            marginLeft: 10,
            backgroundColor: '#7dfac2',
            color: '#00140b',
        },
        botaozao: {
            width: '40%',
            margin: 10,
            backgroundColor: '#7dfac2',
            color: '#00140b',
            borderRadius: 5,
        },
        fonteGrande: {
            fontSize: 25
        },
        fonteMedia: {
            fontSize: 20
        },
        fontePequena: {
            fontSize: 15
        },
        fonteBotao: {
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#6f8c74'
        },
        novaPartida: {
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: 'white',
            top: (Dimensions.get('window').height / 2) - 150,
            width: 300
        },
        escondido: {
            display: 'none'
        },
        botaoEscolheGalera: {
            margin: 5,
            borderRadius: 10,
            padding: 5
        },
        textoCodigo: {
            margin: 20,
            padding: 10,
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            textAlign: 'center',
            alignSelf: 'center',
            fontSize: 30
        }
    });

    const criarGalera = () => {
        navigation.navigate('NovaGalera', route.params);
    }

    useEffect(() => {
        const efeito = async () => {
            let dados = {
                login: route.params.login
            }
            let res = await fetch('http://192.168.1.110:3000/galeras', {
                method: 'post',
                body: JSON.stringify(dados),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setGaleras(await res.json());
        }
        if (!route.params.carregado) {
            route.params.carregado = true;
            efeito();
        }
    })

    const checaSala = async (partida) => {
        let dados = {
            partida,
        }
        let res = await fetch('http://192.168.1.110:3000/partida/espera', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        route.params.idPartida = partida;
        if (resJson.partidaPronta) {
            navigation.navigate('Partida', route.params);
        } else {
            setTimeout(() => { checaSala(partida)}, 1000);
        }

    }

    const criaPartida = async () => {
        let dados = {
            idGaleraEscolhida,
            login: route.params.login
        }
        let res = await fetch('http://192.168.1.110:3000/partida/nova', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        setCodigoPartida(resJson.codigoPartida);
        checaSala(resJson.codigoPartida);
    }

    const procurarPartida = async () => {
        let dados = {
            codigo: codigoEntrar,
            login: route.params.login
        }
        let res = await fetch('http://192.168.1.110:3000/partida/entrar', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let { partida } = await res.json();
        if (partida !== undefined) {
            route.params.idPartida = codigoEntrar;
            navigation.navigate('Partida', route.params);
        } else {
            setPartidaNaoEncontrada(true);
        }
    }

    const carregaGalera = (galera) => {
        route.params.idGalera = galera.id;
        route.params.carregado = false;
        navigation.navigate('NovaGalera', route.params);
    }

    const listaGaleras = galeras.map((galera) => {
        return (
            <View style={styles.galeraContainer}>
                <Text style={styles.fonteGrande}>{galera.nome}</Text>
                <Pressable style={styles.botaoGalera} onPress={() => carregaGalera(galera)}>
                    <Text style={[{textAlign: 'center'}, styles.fonteGrande]}>+</Text>
                </Pressable>
            </View>
        )
    })

    const listaEscolhaGalera = galeras.map((galera) => {
        let estilosGaleraOpcao = [styles.botaoEscolheGalera];
        if (idGaleraEscolhida == galera.id) {
            estilosGaleraOpcao.push({ backgroundColor: '#8cc2a9' });
        } else {
            estilosGaleraOpcao.push({ backgroundColor: '#cccccc' })
        }
        return (
            <Pressable style={estilosGaleraOpcao} onPress={() => setIdGaleraEscolhida(galera.id)}>
                <Text style={styles.fonteMedia}>{galera.nome}</Text>
            </Pressable>
        )
    })

    const escolherGalera = () => {
        if (codigoPartida == null) {
            return (
                <View style={{ height: 300 }}>
                    <Text style={[styles.fontePequena, {marginLeft: 10}]}>Escolha uma galera para jogar</Text>
                    <ScrollView>
                        {listaEscolhaGalera}
                    </ScrollView>
                    <Pressable onPress={criaPartida} style={[styles.botaozao, {alignSelf: 'center'}]}>
                        <Text style={styles.fonteBotao}>Confirmar</Text>
                    </Pressable>
                </View>
            )
        }
    }

    const salaDeEspera = () => {
        if (codigoPartida != null) {
            return (
                <View>
                    <Text style={[styles.fontePequena, { textAlign: 'center' }]}>Informe esse código ao seu amigo</Text>
                    <Text style={styles.textoCodigo}>{codigoPartida}</Text>
                </View>
            )
        }
    }

    const mostraEscondeJanelaNovaPartida = () => {
        if (criandoPartida) {
            setCriandoPartida(false);
        } else {
            setCriandoPartida(true);
        }
    }

    const mostraEscondeJanelaEncontrarPartida = () => {
        if (encontrandoPartida) {
            setEncontrandoPartida(false);
        } else {
            setEncontrandoPartida(true)
        }
    }

    return (
        <View style={{height: '100%'}}>
            <Text style={[{marginLeft: 10}, styles.fonteGrande]}>Olá, {route.params.login}</Text>
            <View style={styles.container}>
                <Pressable onPress={mostraEscondeJanelaEncontrarPartida} style={[styles.botaozao, {backgroundColor: (encontrandoPartida ? '#bcc9bb' : '#7dfac2')}]}>
                    <Text style={styles.fonteBotao}>
                        Encontrar partida
                    </Text>
                </Pressable>
                <Pressable onPress={mostraEscondeJanelaNovaPartida} style={[styles.botaozao, {backgroundColor: (criandoPartida ? '#bcc9bb' : '#7dfac2')}]}>
                    <Text style={styles.fonteBotao}>
                        Criar partida
                    </Text>
                </Pressable>
            </View>
            <View style={styles.galeras}>
                <Text style={styles.fonteGrande}>Galeras</Text>
                <Pressable style={styles.botaozao} onPress={criarGalera}>
                    <Text style={styles.fonteBotao}>Criar Galera</Text>
                </Pressable>
                {listaGaleras}
            </View>
            {criandoPartida && 
                <View style={styles.novaPartida}>
                    <Text style={[styles.fonteGrande, {textAlign: 'center'}]}>Nova partida</Text>
                    {escolherGalera()}
                    {salaDeEspera()}
                </View>
            }
            {encontrandoPartida &&
                <View style={styles.novaPartida}>
                    <Text style={[styles.fonteGrande, {textAlign: 'center'}]}>Entrar em partida</Text>
                    <Text style={[styles.fontePequena, {textAlign: 'center', display: (partidaNaoEncontrada ? 'flex': 'none')}]}>Partida não encontrada</Text>
                    <TextInput style={[styles.input, styles.fonteMedia]} onChangeText={(valor) => { setCodigoEntrar(valor); setPartidaNaoEncontrada(false); }} value={codigoEntrar} placeholder="Código"/>
                    <Pressable onPress={procurarPartida} style={[styles.botaozao, {alignSelf: 'center'}]}>
                        <Text style={styles.fonteBotao}>Entrar</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}