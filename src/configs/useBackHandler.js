import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";

const useBackHandler = (navigation,Screen) => {
  const backAction = () => {
    const routes = navigation.getState().routes;
    const currentRoute = routes;

    const bottomTabRoutes = ["HOME_SCREEN", "BOOKING_SCREEN", "CART_STACK", "FAVORITE_SCREEN", "PROFILE_STACK"];



    if (Screen == 'Home') {
      Alert.alert("Exit App", "Do you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    } else {
      navigation.goBack();
  
      return true;
    }
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [navigation]);

  return null; // The hook doesn't need to return anything
};

export default useBackHandler;
