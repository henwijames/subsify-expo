import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = () => {
    if (!emailAddress.trim()) {
      setErrorMessage("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setErrorMessage(null);

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        setErrorMessage(error.message || "Invalid email or password.");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            const url = decorateUrl("/");
            router.push(url as Href);
          },
        });
      } else {
        setErrorMessage(`Sign-in incomplete: status is ${signIn.status}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred during sign in.");
    }
  };

  const isLoading = fetchStatus === "fetching";

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content justify-center">
            {/* Header/Branding */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">S</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Subsify</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>

              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Auth Form Card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Error Banner */}
                {errorMessage && (
                  <View className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl mb-2">
                    <Text className="auth-error text-center">
                      {errorMessage}
                    </Text>
                  </View>
                )}

                {/* Email Field */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input ${
                      (errorMessage || errors?.fields?.identifier) && !emailAddress
                        ? "auth-input-error"
                        : ""
                    }`}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setEmailAddress}
                    editable={!isLoading}
                  />
                  {errors?.fields?.identifier && (
                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                  )}
                </View>

                {/* Password Field */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${
                      (errorMessage || errors?.fields?.password) && !password
                        ? "auth-input-error"
                        : ""
                    }`}
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    secureTextEntry
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />
                  {errors?.fields?.password && (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  className={`auth-button ${isLoading ? "auth-button-disabled" : ""}`}
                  onPress={handleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </TouchableOpacity>

                {/* Switch to Sign Up */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">New to Subsify?</Text>
                  <Link href="/(auth)/sign-up" asChild>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text className="auth-link">Create an account</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
