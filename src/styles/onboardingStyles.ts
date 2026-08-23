import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "./theme";

const { width, height } = Dimensions.get("window");

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  slide: {
    width,
    height,
    position: "relative",
  },
  slideImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 50,
  },
  topSpace: {
    height: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.cream,
    textAlign: "center",
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
    width: "100%",
    zIndex: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.white,
  },
  footer: {
    gap: 12,
    width: "100%",
    zIndex: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.mediumBrown,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});