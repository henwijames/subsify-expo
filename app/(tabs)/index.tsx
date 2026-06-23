import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-red-500">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to onboarding
      </Link>
      <Link
        className="mt-4 rounded bg-primary text-white p-4"
        href="/(auth)/sign-up"
      >
        Go to Sign Up
      </Link>
      <Link
        className="mt-4 rounded bg-primary text-white p-4"
        href="/(auth)/sign-in"
      >
        Go to Sign In
      </Link>
    </SafeAreaView>
  );
}
