import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Images from './assets/Images';

export default function NovoAmigo ({navigation, route}) {
    const [nome, onChangeNome] = React.useState('Fulano');
    const [image, setImage] = useState(null);
    const createFormData = (uri) => {
        let fileName = uri.split('/').pop();
        const extensao = fileName.split('.')[1];
        const fileType = fileName.split('.').pop();
        const formData = new FormData();
        fileName = `${route.params.idGalera}.${extensao}`;
        formData.append('imgAmigo', {
            uri,
            name: fileName,
            type: `image/${fileType}`
        });
        formData.append('nomeAmigo', nome);
        formData.append('idGalera', route.params.idGalera);

        return formData;
    }

    const postaDados = async () => {
        let data = createFormData(image);
        await fetch('http://192.168.1.110:3000/novo-amigo', {
            method: 'post',
            body: data
        });
        route.params.carregado = false;
        navigation.navigate('NovaGalera', route.params);
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const styles = StyleSheet.create({
        input: {
            height: 40, margin: 12, borderWidth: 1, padding: 10,
        },
    });

    const src = () => {
        if (image != null) {
            var src = {uri: image};
            return src;
        } else {
            return Images.personagemPlaceHolder;
        }
    }

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TextInput style={styles.input} onChangeText={onChangeNome} value={nome}/>
            <Image source={src()} style={{width: 170, height: 170}}/>
            <Button title="Escolher imagem" onPress={pickImage}/>
            <Button title="Enviar" onPress={postaDados}/>
        </View>
    );
}
