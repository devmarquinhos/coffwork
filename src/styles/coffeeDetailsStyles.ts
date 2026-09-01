import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/theme";

export const coffeeDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heroImage: {
    width: "100%",
    height: 450,
    position: "absolute",
    top: 0,
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: COLORS.cream,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  transparentSpacer: {
    height: 350,
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 600,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.darkBrown,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkBrown,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(65, 45, 21, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  tagText: {
    color: COLORS.darkBrown,
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.darkBrown,
    lineHeight: 24,
    marginBottom: 32,
  },
  footer: {
    padding: 24,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
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
});
