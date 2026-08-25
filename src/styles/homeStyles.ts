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
    marginBottom: 16,
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cardContainer: {
    height: 280,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    overflow: "hidden",
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
  emptySearchContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptySearchText: {
    fontSize: 16,
    color: COLORS.darkBrown,
    textAlign: "center",
  },
});