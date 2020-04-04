import React,{useState,useEffect} from 'react';
import {  Text, View, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import {Asset} from 'expo-asset';
import { InMemoryCache } from 'apollo-cache-inmemory';  //새로운 캐시를 만들기 위함
import { persistCache } from 'apollo-cache-persist';  //캐시 유지
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import apolloClientOptions from "./apollo";


export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);

  /*
    font load
    assets load
    make cache & client that has cache

  */
  const preLoad = async () =>{
    try{
      // font load
      await Font.loadAsync({
        ...Ionicons.font
      });

      /*
      load logo
      만약 여러게의 local img를 load하고 싶을때는 [] 사용하면 됨
      */
      await Asset.loadAsync(require("./assets/logo.png"));

      /*
        cache 만들기
        사용자가 앱을 킬 때마다 load를 하는 모습을 보여주지 않기 위해 cache에 데이터를 저장할것임
      */
      const cache = new InMemoryCache();

      await persistCache({
        cache,
        storage: AsyncStorage,
      });

      //캐시를 가지고 있는 client만들기
      const client = new ApolloClient({
        cache,
        ...apolloClientOptions
      });

      setLoaded(true);
      setClient(client);
    }catch(e){
      console.log(e);
    }
  };
  useEffect(()=>{
    preLoad();
  },[]);
  
  // what is ApolloProvider ?
  return loaded && client ? (
    <ApolloProvider client={client}>
      <View>
        <Text>Open up App.js to start working on your app!</Text>
      </View> 
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
