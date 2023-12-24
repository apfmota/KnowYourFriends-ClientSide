import React, { useState, useEffect } from 'react';
import {Text, Button, View, TextInput, StyleSheet } from 'react-native';
const md5 = require("js-md5");
export default function Register ({navigation, route}) {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
    const [resultado, setResultado] = useState(null);

    const registrar = async () => {
        let dados = {
            login,
            senha: md5(senha)
        }
        let res = await fetch('http://192.168.1.110:3000/register', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        let resultadoTemp = resJson.resultado;
        setResultado(resJson.resultado);
        if (resultadoTemp == "Sucesso") {
            setTimeout(() => {
                navigation.navigate('Login', { login });
            }, 1000);
        }
    }

    const styles = StyleSheet.create({
        input: {
            height: 40, margin: 12, borderWidth: 1, padding: 10,
        },
        erro: {
            color: 'darkred'
        }
    });

    const mensagemConfirmarSenha = () => {
        if (senha != senhaConfirmacao) {
            return (
                <Text style={styles.erro}>As senhas não são iguais</Text>
            )
        }
    }

    const mensagemResultado = () => {
        if (resultado != null) {
            return (
                <Text>{resultado}</Text>
            )
        }
    }

    const podeEnviar = () => {
        return senha.length > 3 && senhaConfirmacao.length > 3 && senha ==  senhaConfirmacao
    }

    return (
        <View>
            {mensagemResultado()}
            {mensagemConfirmarSenha()}
            <TextInput placeholder='Login' style={styles.input} value={login} onChangeText={setLogin}/>
            <TextInput autoCapitalize='none' placeholder='Senha' secureTextEntry={true} style={styles.input} value={senha} onChangeText={setSenha}/>
            <TextInput autoCapitalize='none' placeholder='Confirmação da senha' secureTextEntry={true} style={styles.input} value={senhaConfirmacao} onChangeText={setSenhaConfirmacao}/>
            <Button title="Enviar" onPress={podeEnviar() ? registrar : null}/>
        </View>
    );
}