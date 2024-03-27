import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, Image, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const MapScreen = ({ route }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { start, target } = route.params;

  useEffect(() => {
    async function fetchMapContent() {
      try {
        const response = await fetch("http://192.168.253.147:5000/map", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start: start,
            target: target,
          }),
        });
        const data = await response.json();
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          const mapHtml = data.map;
          setHtmlContent(mapHtml);
        }
      } catch (error) {
        console.error("Error fetching map content:", error);
        ToastAndroid.show(
          "Error fetching map content:",
          error,
          ToastAndroid.SHORT
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMapContent();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#550003" />
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.messageText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <WebView
        source={{ html: htmlContent || undefined}}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/MGMLogo.png")} style={styles.logo} />
      <Text style={styles.headerText}>MGM's Campus Navigation Module</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#550003",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 20,
  },
  headerText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MapScreen;
