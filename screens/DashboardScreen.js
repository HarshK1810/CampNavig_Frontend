import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://192.168.253.147:5000/dashboard", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Server responded with status: " + response.status);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#550003" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {dashboardData ? (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            Hey {dashboardData.fullname}
          </Text>
        </View>
      ) : (
        <Text>Error: Dashboard data not available</Text>
      )}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => {
          // Handle navigation to the MapScreen
          navigation.navigate("LocationSelection");
        }}
      >
        <Text style={styles.linkText}>Campus Navigation Module</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 20,
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  userInfo: {
    marginTop: 20,
    textAlign: "center",
  },
  userInfoText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: "#550003",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  linkText: {
    color: "#fff",
    textAlign:"left",
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DashboardScreen;
