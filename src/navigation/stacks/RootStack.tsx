import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";

import { MainTabNavigator } from "../MainTabNavigator";
import { AddTransactionScreen } from "../../screens/AddTransactionScreen";
import { TransactionDetailScreen } from "../../screens/TransactionDetailScreen";
import { OnboardingBalanceScreen } from "../../screens/OnboardingBalanceScreen";
import { EditTransactionScreen } from "../../screens/EditTransactionScreen";
import { LoginScreen } from "../../screens/LoginScreen";
import { RegisterScreen } from "../../screens/RegisterScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStackNavigator(props: {
  initialRouteName: "Login" | "Onboarding" | "MainTabs";
}) {
  return (
    <Stack.Navigator initialRouteName={props.initialRouteName}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Masuk", headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Buat Akun", headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingBalanceScreen as any}
        options={{ title: "Saldo Awal", headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen as any}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen as any}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransactionScreen as any}
        options={{ title: "Edit" }}
      />
    </Stack.Navigator>
  );
}
