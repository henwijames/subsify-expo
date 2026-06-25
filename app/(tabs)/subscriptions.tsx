import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((sub) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      sub.name.toLowerCase().includes(query) ||
      (sub.category && sub.category.toLowerCase().includes(query)) ||
      (sub.plan && sub.plan.toLowerCase().includes(query)) ||
      (sub.status && sub.status.toLowerCase().includes(query))
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-6">
        <Text className="text-3xl font-sans-bold text-primary mb-4">
          Subscriptions
        </Text>
        <View className="relative">
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary pr-12"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              className="absolute right-4 top-4"
            >
              <Text className="text-base font-sans-bold text-accent">Clear</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
            expanded={expandedSubscriptionId === item.id}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-lg font-sans-semibold text-muted-foreground">
              No subscriptions found
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground/60 mt-1">
              Try searching with another keyword
            </Text>
          </View>
        }
        contentContainerClassName="pb-10"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;

