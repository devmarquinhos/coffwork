import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  const { user } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const rootSegment = segments[0] as string;
    const inAuthGroup = rootSegment === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/onboarding" as any);
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)" as any);
    }
  }, [user, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}