import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/theme";

export const editProfileStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: COLORS.darkBrown, marginBottom: 40 },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  button: {
    backgroundColor: COLORS.mediumBrown,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  registerTextNormal: {
    color: COLORS.darkBrown,
    fontSize: 15,
  },
  registerTextBold: {
    color: COLORS.mediumBrown,
    fontSize: 15,
    fontWeight: "bold",
  },
});
