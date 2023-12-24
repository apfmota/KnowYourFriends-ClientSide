import React, { useState, useEffect } from 'react';
import {Dimensions, Text, Pressable, Image, Button, View, TextInput, StyleSheet, ScrollView } from 'react-native';
import FuncoesUteis from './FuncoesUteis'
import Images from './assets/Images';

export default function Partida ({navigation, route}) {
    const [amigos, setAmigos] = useState([])
    const [oponente, setOponente] = useState(null)
    const [resposta, setResposta] = useState([]) //gambiarra
    const [amigosDescartados, setAmigosDescartados] = useState([])
    const [amigosSelecionados, setAmigosSelecionados] = useState([])
    const [vez, setVez] = useState(false);
    const [amigoPalpite, setAmigoPalpite] = useState(null);
    const [amigoTemporariamenteEscondido, setAmigoTemporariamenteEscondido] = useState(null);
    const [vitoria, setVitoria] = useState(null);

    const styles = StyleSheet.create({
        input: {
            height: 40, margin: 12, borderWidth: 1, padding: 10,
        },
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap'
        },
        carta: {
            borderRadius: 10,
            borderWidth: 7,
            borderColor: '#3e4656',
            backgroundColor: '#3e4656',
        },
        cartaSelecionavel: {
            width: '20%',
            height: (Dimensions.get('window').width / 5) * 1.5,
            margin: 5,
            paddingBottom: 25
        },
        centro: {
            textAlign: 'center'
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
        fonteVersus: {
            color: '#A01F1F',
            fontWeight: 'bold'
        },
        fonteBotao: {
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#6f8c74'
        },
        botaozao: {
            width: '20%',
            margin: 10,
            backgroundColor: '#7dfac2',
            color: '#00140b',
            height: 40,
            borderRadius: 20,
        }, 
        textoCarta: {
            alignSelf: 'center',
            backgroundColor: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: 3,
            borderRadius: 3,
            marginTop: 2
        },
        cartaSelecionada: {
            borderWidth: 5,
            borderColor: 'rgba(255, 0, 0, 0.4)',
        },
        palpite: {
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: '#b6d9cb',
            borderRadius: 5,
            top: (Dimensions.get('window').height / 2) - 150,
            width: 200,
            padding: 10,
            height: 300
        },
        botaozinho: {
            padding: 5,
            margin: 5,
            borderRadius: 5,
            width: '30%'
        },
        vitoria: {
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: '#ebc660',
            borderRadius: 5,
            top: (Dimensions.get('window').height / 2) - 75,
            width: 180,
            padding: 10,
            height: 150    
        }
    })

    useEffect(() => {
        const efeito = async () => {
            let dados = {
                login: route.params.login,
                idPartida: route.params.idPartida
            }
            let res = await fetch('http://192.168.1.110:3000/partida/carregar', {
                method: 'post',
                body: JSON.stringify(dados),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            let resJson = await res.json();
            setAmigos(resJson.amigos);
            setOponente(resJson.oponente);
            setResposta(resJson.amigoResposta);
            setVez(resJson.vez);
            if (!resJson.vez) {
                setTimeout(esperaVez, 1000);
            }
        }
        efeito();
    }, [])
    
    const esperaVez = async () => {
        let dados = {
            login: route.params.login,
            idPartida: route.params.idPartida
        }
        let res = await fetch('http://192.168.1.110:3000/partida/espera-vez', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        if (resJson.vezMudou) {
            setVez(true)
        } else if (resJson.vitoria != undefined) {
            setVitoria(resJson.vitoria);
        } else {
            setTimeout(esperaVez, 1000)
        }
    }

    const jogada = async () => {
        let dados = {
            cartasSelecionadas: amigosSelecionados,
            idPartida: route.params.idPartida
        }
        let res = await fetch('http://192.168.1.110:3000/partida/jogada', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        setVez(false);
        setAmigosDescartados([...amigosDescartados, ...amigosSelecionados])
        setAmigosSelecionados([]);
        setTimeout(esperaVez, 1000);
    }

    const palpitar = async () => {
        let dados = {
            amigoPalpite,
            idPartida: route.params.idPartida,
            login: route.params.login
        }
        let res = await fetch('http://192.168.1.110:3000/partida/palpite', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        setVitoria(resJson.ganhou);
    }

    const palpiteFinal = (idAmigoSelecionadoParaDescarte) => {
        const amigoPalpite = amigos.filter((a) => a.id != idAmigoSelecionadoParaDescarte && amigosSelecionados.indexOf(a.id) == -1 && amigosDescartados.indexOf(a.id) == -1)[0];
        setAmigoPalpite(amigoPalpite);
    }

    const listaAmigos = amigos.map((amigo) => {
        const selecionado = amigosSelecionados.indexOf(amigo.id) > -1;
        const descartado = amigosDescartados.indexOf(amigo.id) > -1;
        const temporariamenteEscondido = amigo.id == amigoTemporariamenteEscondido;
        const funcaoSeleciona = () => {
            let amigosSelecionadosArray = amigosSelecionados;
            if ((amigos.length - (amigosSelecionadosArray.length + amigosDescartados.length)) == 2) {
                setAmigoTemporariamenteEscondido(amigo.id);
                palpiteFinal(amigo.id);
            } else {
                amigosSelecionadosArray = [...amigosSelecionadosArray, amigo.id];
                setAmigosSelecionados(amigosSelecionadosArray);
            }
        }
        const funcaoDesvira = () => {
            let amigosSelecionadosArray = amigosSelecionados;
            amigosSelecionadosArray = amigosSelecionadosArray.filter((a) => { return a != amigo.id});
            setAmigosSelecionados(amigosSelecionadosArray);
        }
        const funcaoAmigo = selecionado ? funcaoDesvira : !descartado ? funcaoSeleciona : null;
        return (
            <Pressable onPress={() => { if (vez && !(descartado || temporariamenteEscondido) ) { funcaoAmigo() }}} style={[styles.carta, styles.cartaSelecionavel, (selecionado ? styles.cartaSelecionada : null)]}>
                {funcaoAmigo}
                <Image source={FuncoesUteis.iconeAmigo(amigo, !(selecionado || descartado || temporariamenteEscondido))} style={{width: '100%', height: '100%'}}/>
                {!(selecionado || descartado || temporariamenteEscondido) &&
                    <Text style={styles.textoCarta}>{amigo.nome}</Text>
                }
            </Pressable>
        )
    })

    return (
        <View>
            <View style={styles.container}>
                <View>
                    <Text style={[styles.centro, styles.fonteMedia]}>{route.params.login}</Text>
                    <View style={styles.carta}>
                        <Image source={{ uri: FuncoesUteis.iconeAmigoUrl(resposta[0]) }} style={{width: 60, height: 80}}/>
                        <Text style={[styles.textoCarta, {fontSize: 10}]}>{resposta[0] != undefined ? resposta[0].nome : ''}</Text>
                    </View>
                </View>
                <Text style={[styles.fonteGrande, styles.fonteVersus]}>VS</Text>
                <View>
                    <Text style={[styles.centro, styles.fonteMedia]}>{oponente}</Text>
                    <View style={styles.carta}>
                        <Image source={Images.desconhecido} style={{width: 60, height: 80}}/>
                        <Text style={[styles.textoCarta, {fontSize: 10}]}>???</Text>
                    </View>
                </View>
            </View>
            <View style={{height: 50}}>
                {vez &&
                    <Pressable onPress={() => jogada()} style={[styles.botaozao, {alignSelf: 'center'}]}>
                        <Text style={styles.fonteBotao}>Feito</Text>
                    </Pressable>
                }
                {!vez &&
                    <Text style={[styles.centro, styles.fonteMedia, {paddingTop: 10}]}>Espere o adversário fazer sua jogada</Text>
                }
            </View>
            <ScrollView contentContainerStyle={[styles.container, {height: (Dimensions.get('window').height * 0.7)}]}>
                {listaAmigos}
            </ScrollView>
            {(amigoPalpite != null) &&
                <View style={styles.palpite}>
                    <Text style={[styles.centro, { margin: 10 }]}>{amigoPalpite.nome} é o seu palpite final?</Text>
                    <View style={[styles.carta, styles.cartaSelecionavel, {alignSelf: 'center'}, {width: 90, height: 150}]}>
                        <Image source={{ uri: FuncoesUteis.iconeAmigoUrl(amigoPalpite)}} style={{width: '100%', height: '100%'}}/>
                        <Text style={styles.textoCarta}>{amigoPalpite.nome}</Text>
                    </View>
                    <View style={styles.container}>
                        <Pressable style={[styles.botaozinho, {backgroundColor: '#26ad3d'}]} onPress={() => { setAmigoPalpite(null); palpitar(); }}>
                            <Text style={[styles.centro, {color: 'white'}]}>Sim</Text>
                        </Pressable>
                        <Pressable style={[styles.botaozinho, {backgroundColor: '#e33232'}]} onPress={() => { setAmigoPalpite(null); setAmigoTemporariamenteEscondido(null); }}>
                            <Text style={[styles.centro, {color: 'white'}]}>Não</Text>
                        </Pressable>
                    </View>
                </View>
            }
            {(vitoria != null && vitoria) &&
                <View style={styles.vitoria}>
                    <Text style={[styles.centro, styles.fonteGrande]}>Parabéns</Text>
                    <Text style={styles.centro}>Você venceu!</Text>
                    <Pressable onPress={() => { navigation.navigate('Home', route.params) }} style={[styles.botaozao, { alignSelf: 'center', width: '40%'}]}>
                        <Text style={styles.fonteBotao}>Sair</Text>
                    </Pressable>
                </View>
            }
            {(vitoria != null && !vitoria) && 
                <View style={styles.vitoria}>
                    <Text style={[styles.centro, styles.fonteGrande]}>Derrota</Text>
                    <Text style={styles.centro}>Você perdeu!</Text>
                    <Pressable onPress={() => { navigation.navigate('Home', route.params) }} style={[styles.botaozao, { alignSelf: 'center', width: '40%'}]}>
                        <Text style={styles.fonteBotao}>Sair</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
