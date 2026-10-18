import { NavigationContainer } from "@react-navigation/native";
import { RootStackNavigator } from "./stacks/RootStack";

export function AppNavigator(props: {
  initialRouteName: "Login" | "Onboarding" | "MainTabs";
}) {
  return (
    <NavigationContainer>
      <RootStackNavigator initialRouteName={props.initialRouteName} />
    </NavigationContainer>
  );
}
