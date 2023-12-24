import React, { useState, useEffect } from 'react';
import {Text, Image, Button, View, TextInput, StyleSheet, ScrollView } from 'react-native';
import FuncoesUteis from './FuncoesUteis'
export default function NovaGalera ({navigation, route}) {
    const [nome, setNome] = useState('');
    const [id, setId] = useState(0);
    const [amigos, setAmigos] = useState([]);

    useEffect(() => {
        const efeito = async () => {
            let dados = {
                idGalera: route.params.idGalera
            }
            let res = await fetch('http://192.168.1.110:3000/amigos-galera', {
                method: 'post',
                body: JSON.stringify(dados),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            let amigosJson = await res.json();
            setAmigos(amigosJson);
        }
        if (!route.params.carregado) {
            route.params.carregado = true;
            setId(route.params.idGalera);
            efeito();
        }
    })

    const styles = StyleSheet.create({
        containerAmigo: {
            display: 'flex',
            flexDirection: 'row',
            margin: 10,
            backgroundColor: '#cccccc',
            padding: 10,
            borderRadius: 10
        },
        iconeAmigo: {
            borderRadius: 10,
            overflow: 'hidden',
            marginRight: 10
        },
        nomeAmigo: {
            fontWeight: "bold",
            fontSize: 24
        }
    });

    const listaAmigos = amigos.map((amigo) => {
        return (
            <View style={styles.containerAmigo}>
                <View style={styles.iconeAmigo}>
                    <Image source={{ uri: FuncoesUteis.iconeAmigoUrl(amigo) }} style={{width: 60, height: 80}}/>
                </View>
                <View>
                    <Text style={styles.nomeAmigo}>{amigo.nome}</Text>
                </View>
            </View>
        )
    })

    const adicionarAmigo = () => {
        navigation.navigate("NovoAmigo", { login: route.params.login, idGalera: id});
    }

    const cadastrar = async () => {
        let dados = {
            nome,
            login: route.params.login
        }
        let res = await fetch('http://192.168.1.110:3000/nova-galera', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        setId(resJson.id);
    }

    const semCadastro = () => {
        if (id == 0) {
            return (
                <View>
                    <TextInput placeholder='Nome' value={nome} onChangeText={setNome}/>
                    <Button title="Enviar" onPress={cadastrar}/>
                </View>
            )
        }
    }

    const cadastrado = () => {
        if (id != 0) {
            return (
                <View>
                    <Text>{nome}</Text>
                    <ScrollView style={{height: '90%'}}>
                        {listaAmigos}
                    </ScrollView>
                    <Button title="Adicionar amigo" onPress={adicionarAmigo}/>
                </View>
            )
        }
    }

    return (
        <View>
            {semCadastro()}
            {cadastrado()}
        </View>
    )
}