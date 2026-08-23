import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export const reviewListStyles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 40,
  },
  emptyContainer: {
    height: 100,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    padding: 16,
  },
  emptyText: {
    color: COLORS.mediumBrown,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(65, 45, 21, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.black,
  },
  date: {
    fontSize: 12,
    color: COLORS.darkBrown,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.mediumBrown,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  contextPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(65, 45, 21, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  contextText: {
    color: COLORS.darkBrown,
    fontSize: 12,
    fontWeight: "600",
  },
  comment: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
  },
});
