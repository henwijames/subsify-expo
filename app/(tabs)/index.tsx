import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4 font-sans-bold"
      >
        Go to Onboarding
      </Link>
      <Link
        className="mt-4 rounded bg-primary text-white p-4 font-sans-bold"
        href="/(auth)/sign-up"
      >
        Go to Sign Up
      </Link>
      <Link
        className="mt-4 rounded bg-primary text-white p-4 font-sans-bold"
        href="/(auth)/sign-in"
      >
        Go to Sign In
      </Link>
    </SafeAreaView>
  );
}
