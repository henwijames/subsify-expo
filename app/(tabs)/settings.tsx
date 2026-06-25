import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const fullName = user?.fullName || "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5 gap-2">
      <View>
        <Text className="text-3xl font-sans-bold text-primary mb-6">
          Settings
        </Text>
        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="font-sans-semibold text-3xl text-primary mb-1">
            {fullName}
          </Text>
          <Text className="font-sans-medium text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="items-center rounded-2xl bg-primary py-4 active:opacity-80"
        onPress={() => signOut()}
      >
        <Text className="font-sans-bold text-background text-base">
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
