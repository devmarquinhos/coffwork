import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkBrown,
    marginTop: 4,
  },
  pillsContainer: {
    paddingLeft: 24,
    marginBottom: 24,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  pillActive: {
    backgroundColor: COLORS.mediumBrown,
  },
  pillText: {
    color: COLORS.darkBrown,
    fontWeight: "600",
  },
  pillTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cardContainer: {
    height: 280,
    marginBottom: 24,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: 24,
    backgroundColor: COLORS.cream,
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 24,
    overflow: "hidden",
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardSubtitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "500",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    color: COLORS.darkBrown,
    fontWeight: "bold",
    fontSize: 14,
  },
});