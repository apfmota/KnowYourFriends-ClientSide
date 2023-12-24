import React, { useState, useEffect } from 'react';
import { Text, Button, View, TextInput, StyleSheet } from 'react-native';
const md5 = require("js-md5");
export default function Login ({navigation, route}) {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [loginFalhou, setLoginFalhou] = useState(false);

    useEffect(() => {
        if (route.params != undefined && !route.params.carregado) {
            route.params.carregado = true;
            setLogin(route.params.login);
        }
    })

    const styles = StyleSheet.create({
        input: {
            height: 40, margin: 12, borderWidth: 1, padding: 10,
        },
    });

    const fazLogin = async () => {
        let dados = {
            login,
            senha: md5(senha)
        }
        let res = await fetch('http://192.168.1.110:3000/login', {
            method: 'post',
            body: JSON.stringify(dados),
            headers: {
                "Content-Type": "application/json",
            }
        });
        let resJson = await res.json();
        if (resJson.logou) {
            navigation.navigate('Home', { login, carregado: false });
        } else {
            setLoginFalhou(true);
        }
    }

    const registrar = () => {
        navigation.navigate('Register', {});
    }

    const mensagemLogin = () => {
        if (loginFalhou) {
            return (
                <Text>Login ou senha inválidos</Text>
            )
        }
    }

    return (
        <View>
            {mensagemLogin()}
            <TextInput placeholder='Login' style={styles.input} value={login} onChangeText={setLogin}/>
            <TextInput placeholder='Senha' autoCapitalize='none' secureTextEntry={true} style={styles.input} value={senha} onChangeText={setSenha}/>
            <Button title="Entrar" onPress={fazLogin}/>
            <Button title="Registrar-se" onPress={registrar}/>
        </View>
    );
}