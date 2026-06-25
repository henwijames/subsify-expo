import { useSignUp } from "@clerk/expo";
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

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateSignUp = () => {
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
      setErrorMessage("Please enter a password.");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;
    setErrorMessage(null);

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        setErrorMessage(error.message || "Failed to create account.");
        return;
      }

      const verificationResult = await signUp.verifications.sendEmailCode();
      if (verificationResult.error) {
        setErrorMessage(verificationResult.error.message || "Failed to send verification code.");
        return;
      }

      setPendingVerification(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred during signup.");
    }
  };

  const handleVerify = async () => {
    if (!code) {
      setErrorMessage("Please enter the verification code.");
      return;
    }
    setErrorMessage(null);

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (verifyResult.error) {
        setErrorMessage(verifyResult.error.message || "Invalid verification code.");
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            const url = decorateUrl("/");
            router.push(url as Href);
          },
        });
      } else {
        setErrorMessage(`Sign-up incomplete: status is ${signUp.status}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred during verification.");
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    try {
      const res = await signUp.verifications.sendEmailCode();
      if (res.error) {
        setErrorMessage(res.error.message || "Could not resend code.");
      } else {
        setErrorMessage("A new code has been sent to your email.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Could not resend code.");
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

              <Text className="auth-title">
                {pendingVerification ? "Verify Account" : "Create Account"}
              </Text>
              <Text className="auth-subtitle">
                {pendingVerification
                  ? `Enter the code sent to ${emailAddress}`
                  : "Sign up to start tracking your subscriptions easily"}
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

                {!pendingVerification ? (
                  <>
                    {/* Email Field */}
                    <View className="auth-field">
                      <Text className="auth-label">Email</Text>
                      <TextInput
                        className={`auth-input ${
                          (errorMessage || errors?.fields?.emailAddress) && !emailAddress
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
                      {errors?.fields?.emailAddress && (
                        <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
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
                        placeholder="Create a password (min 8 chars)"
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
                      onPress={handleSignUp}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Sign up</Text>
                      )}
                    </TouchableOpacity>

                    {/* Switch to Sign In */}
                    <View className="auth-link-row">
                      <Text className="auth-link-copy">Already have an account?</Text>
                      <Link href="/(auth)/sign-in" asChild>
                        <TouchableOpacity activeOpacity={0.7}>
                          <Text className="auth-link">Sign in</Text>
                        </TouchableOpacity>
                      </Link>
                    </View>
                  </>
                ) : (
                  <>
                    {/* Verification Code Field */}
                    <View className="auth-field">
                      <Text className="auth-label">Verification Code</Text>
                      <TextInput
                        className={`auth-input ${
                          errors?.fields?.code ? "auth-input-error" : ""
                        }`}
                        keyboardType="number-pad"
                        value={code}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                        onChangeText={setCode}
                        editable={!isLoading}
                      />
                      {errors?.fields?.code && (
                        <Text className="auth-error">{errors.fields.code.message}</Text>
                      )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                      className={`auth-button ${isLoading ? "auth-button-disabled" : ""}`}
                      onPress={handleVerify}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Verify</Text>
                      )}
                    </TouchableOpacity>

                    {/* Resend Code Option */}
                    <TouchableOpacity
                      className="auth-secondary-button mt-2"
                      onPress={handleResend}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      <Text className="auth-secondary-button-text">Resend verification code</Text>
                    </TouchableOpacity>

                    {/* Go Back */}
                    <TouchableOpacity
                      className="items-center py-2 mt-2"
                      onPress={() => setPendingVerification(false)}
                      disabled={isLoading}
                    >
                      <Text className="auth-link-copy text-sm">Go back</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
